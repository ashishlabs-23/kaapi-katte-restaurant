/**
 * KAAPI KATTE API SERVICE
 * Bridge between the React frontend and the remote Google Apps Script ledger.
 */

const DEFAULT_BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwjMwCGYCjlVulghFUXlm3BWW9j6VBnnoNcRqG3MoSvz-Gqr2nItRTV-k1w2uEl__Ut/exec';
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL).trim();
const API_TIMEOUT_MS = Number(import.meta.env.VITE_BACKEND_TIMEOUT_MS || 10000);

export const EMPTY_DAILY_STATS = Object.freeze({
    dailyTotal: 0,
    orderCount: 0,
    bestSellers: [],
    recentOrders: []
});

function ensureBackendConfigured() {
    if (!BACKEND_URL || BACKEND_URL === 'PLACEHOLDER_URL') {
        throw new Error('Backend configuration missing. Set VITE_BACKEND_URL.');
    }
}

function toNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function parseJsonSafely(value) {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

function getCustomerName(customer) {
    if (typeof customer === 'string' && customer.trim()) {
        return customer.trim();
    }

    if (customer && typeof customer === 'object') {
        if (typeof customer.name === 'string' && customer.name.trim()) {
            return customer.name.trim();
        }

        if (typeof customer.phone === 'string' && customer.phone.trim()) {
            return customer.phone.trim();
        }
    }

    return 'Guest';
}

function formatOrderTime(timestamp) {
    if (!timestamp) {
        return 'Now';
    }

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
        return 'Now';
    }

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function normalizeLineItem(item) {
    const count = Math.max(1, toNumber(item?.count, 1));
    const price = toNumber(item?.price, 0);

    return {
        name: item?.name || 'Untitled item',
        count,
        price,
        total: toNumber(item?.total, price * count)
    };
}

function normalizeLineItems(items) {
    if (Array.isArray(items)) {
        return items.map(normalizeLineItem);
    }

    if (typeof items === 'string' && items.trim()) {
        const parsed = parseJsonSafely(items);
        if (Array.isArray(parsed)) {
            return parsed.map(normalizeLineItem);
        }
    }

    return [];
}

function normalizeManifest(items) {
    const lineItems = normalizeLineItems(items);

    if (lineItems.length > 0) {
        return lineItems;
    }

    if (typeof items === 'string' && items.trim()) {
        return items.trim();
    }

    return [];
}

function serializeItems(items) {
    const lineItems = normalizeLineItems(items);

    if (lineItems.length > 0) {
        return lineItems.map((item) => `${item.count}x ${item.name}`).join(', ');
    }

    if (typeof items === 'string' && items.trim()) {
        return items.trim();
    }

    return '';
}

function normalizeBestSeller(item) {
    const count = Math.max(0, toNumber(item?.count));
    const total = toNumber(item?.total);
    const name = item?.name || 'Untitled item';

    return { name, count, total };
}

function normalizeRecentOrder(order, index = 0) {
    return {
        id: order?.id || order?.orderId || `ORD-REMOTE-${index + 1}`,
        customer: getCustomerName(order?.customer ?? order?.customerName),
        items: normalizeManifest(order?.items),
        total: toNumber(order?.total),
        time: order?.time || formatOrderTime(order?.timestamp),
        timestamp: order?.timestamp || null
    };
}

export function normalizeDailyStats(data) {
    if (!data || typeof data !== 'object') {
        return { ...EMPTY_DAILY_STATS };
    }

    const recentOrders = Array.isArray(data.recentOrders)
        ? data.recentOrders.map((order, index) => normalizeRecentOrder(order, index))
        : [];

    const bestSellers = Array.isArray(data.bestSellers)
        ? data.bestSellers.map(normalizeBestSeller)
        : [];

    return {
        dailyTotal: toNumber(
            data.dailyTotal,
            recentOrders.reduce((sum, order) => sum + toNumber(order.total), 0)
        ),
        orderCount: toNumber(data.orderCount, recentOrders.length),
        bestSellers,
        recentOrders
    };
}

export function hasMeaningfulStats(stats) {
    return Boolean(
        stats &&
        (
            stats.orderCount > 0 ||
            (Array.isArray(stats.bestSellers) && stats.bestSellers.length > 0) ||
            (Array.isArray(stats.recentOrders) && stats.recentOrders.length > 0)
        )
    );
}

export function buildLocalStatsFromOrders(orders = []) {
    if (!Array.isArray(orders) || orders.length === 0) {
        return { ...EMPTY_DAILY_STATS };
    }

    const todayKey = new Date().toDateString();
    const todaysOrders = orders.filter((order) => {
        const parsedDate = new Date(order?.timestamp);
        return !Number.isNaN(parsedDate.getTime()) && parsedDate.toDateString() === todayKey;
    });

    if (todaysOrders.length === 0) {
        return { ...EMPTY_DAILY_STATS };
    }

    const bestsellerMap = new Map();

    const recentOrders = [...todaysOrders]
        .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
        .slice(0, 8)
        .map((order, index) => normalizeRecentOrder(order, index));

    todaysOrders.forEach((order) => {
        normalizeLineItems(order?.items).forEach((item) => {
            const existing = bestsellerMap.get(item.name) || { name: item.name, count: 0, total: 0 };
            bestsellerMap.set(item.name, {
                name: item.name,
                count: existing.count + item.count,
                total: existing.total + item.total
            });
        });
    });

    const bestSellers = [...bestsellerMap.values()]
        .sort((left, right) => right.count - left.count || right.total - left.total)
        .slice(0, 5);

    return {
        dailyTotal: todaysOrders.reduce((sum, order) => sum + toNumber(order?.total), 0),
        orderCount: todaysOrders.length,
        bestSellers,
        recentOrders
    };
}

async function fetchWithTimeout(url, options = {}) {
    ensureBackendConfigured();

    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } catch (error) {
        if (error?.name === 'AbortError') {
            throw new Error('Backend request timed out');
        }

        throw error;
    } finally {
        globalThis.clearTimeout(timeoutId);
    }
}

async function parseJsonResponse(response, fallbackMessage) {
    if (!response.ok) {
        throw new Error(`${fallbackMessage} (${response.status})`);
    }

    const rawBody = await response.text();
    if (!rawBody) {
        return {};
    }

    const parsed = parseJsonSafely(rawBody);
    if (!parsed) {
        throw new Error('Backend returned invalid JSON');
    }

    return parsed;
}

function buildStatsUrl() {
    try {
        const url = new URL(BACKEND_URL);
        url.searchParams.set('action', 'getDailyStats');
        return url.toString();
    } catch {
        return BACKEND_URL;
    }
}

function buildPaymentPayload(paymentData) {
    const customer = paymentData?.customer ?? null;
    const customerPhone = typeof customer === 'object' && customer !== null
        ? `${customer.phone || paymentData?.customerPhone || ''}`.trim()
        : `${paymentData?.customerPhone || ''}`.trim();
    const customerName = getCustomerName(customer ?? paymentData?.customerName);
    const items = normalizeLineItems(paymentData?.items);

    return {
        action: 'recordPayment',
        orderId: paymentData?.orderId || paymentData?.id || `ORD-${Date.now()}`,
        total: toNumber(paymentData?.total),
        customer: customerName,
        customerName,
        customerPhone,
        items: serializeItems(items),
        itemsJson: JSON.stringify(items),
        time: paymentData?.time || formatOrderTime(paymentData?.timestamp),
        timestamp: paymentData?.timestamp || new Date().toISOString()
    };
}

export const apiService = {
    async createOrder(amount) {
        const sanitizedAmount = toNumber(amount);
        if (sanitizedAmount <= 0) {
            throw new Error('Invalid order amount');
        }

        const response = await fetchWithTimeout(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify({
                action: 'createOrder',
                amount: sanitizedAmount
            })
        });

        const payload = await parseJsonResponse(response, 'Order creation failed');

        return {
            ...payload,
            amount: toNumber(payload?.amount, sanitizedAmount)
        };
    },

    async recordPayment(paymentData) {
        const payload = buildPaymentPayload(paymentData);

        try {
            await fetchWithTimeout(BACKEND_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });

            return {
                status: 'sent',
                sentAt: new Date().toISOString()
            };
        } catch (error) {
            throw new Error(error?.message || 'Unable to sync order to backend');
        }
    },

    async getDailyStats() {
        const response = await fetchWithTimeout(buildStatsUrl(), {
            method: 'GET'
        });

        const payload = await parseJsonResponse(response, 'Stats fetch failed');
        return normalizeDailyStats(payload);
    }
};
