import { useMemo, useState } from "react";
import type { ClientData, ProductCategoryId, QuoteDraft, QuoteItem } from "@/lib/quoteTypes";
import { apiFetch } from "@/lib/api";
import {
  ACABADOS_ALUMINIO,
  DEFAULT_IVA_PERCENT,
  EMPTY_DRAFT,
  HERRAJES,
  LINEAS_ALUMINIO,
  PRODUCT_CATEGORIES,
  TIPOS_VIDRIO,
  calcUnitPrice,
  getById,
} from "@/lib/quoteConfig";

const EMPTY_CLIENT: ClientData = { name: "", phone: "", email: "", address: "", postalCode: "" };

export function useQuoteBuilder() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [draft, setDraft] = useState<QuoteDraft>(EMPTY_DRAFT);
  const [cart, setCart] = useState<QuoteItem[]>([]);
  const [client, setClient] = useState<ClientData>(EMPTY_CLIENT);
  const [ivaPercent, setIvaPercent] = useState(DEFAULT_IVA_PERCENT);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedQuote, setSavedQuote] = useState<{ id: string; folio: string; createdAt: string } | null>(null);
  const [savingQuote, setSavingQuote] = useState(false);

  const category = draft.categoryId ? PRODUCT_CATEGORIES.find((c) => c.id === draft.categoryId) ?? null : null;

  const live = useMemo(
    () =>
      calcUnitPrice({
        widthCm: draft.widthCm,
        heightCm: draft.heightCm,
        lineaId: draft.lineaId,
        acabadoId: draft.acabadoId,
        vidrioId: draft.vidrioId,
        herrajeIds: draft.herrajeIds,
      }),
    [draft.widthCm, draft.heightCm, draft.lineaId, draft.acabadoId, draft.vidrioId, draft.herrajeIds]
  );

  function selectProduct(categoryId: ProductCategoryId, subtypeId: string, subtypeLabel: string) {
    const cat = PRODUCT_CATEGORIES.find((c) => c.id === categoryId)!;
    setDraft({
      ...EMPTY_DRAFT,
      categoryId,
      subtypeId,
      subtypeLabel,
      widthCm: Math.round((cat.limits.minW + cat.limits.maxW) / 2),
      heightCm: Math.round((cat.limits.minH + cat.limits.maxH) / 2),
    });
    setStep(2);
  }

  function updateDraft(patch: Partial<QuoteDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  function toggleHerraje(id: string) {
    setDraft((d) => ({
      ...d,
      herrajeIds: d.herrajeIds.includes(id) ? d.herrajeIds.filter((h) => h !== id) : [...d.herrajeIds, id],
    }));
  }

  function confirmDraftToCart() {
    if (!draft.categoryId || !category) return;
    const linea = getById(LINEAS_ALUMINIO, draft.lineaId);
    const acabado = getById(ACABADOS_ALUMINIO, draft.acabadoId);
    const vidrio = getById(TIPOS_VIDRIO, draft.vidrioId);

    const item: QuoteItem = {
      id: `item-${Date.now()}`,
      categoryId: draft.categoryId,
      categoryLabel: category.label,
      subtypeLabel: draft.subtypeLabel ?? category.label,
      widthCm: draft.widthCm,
      heightCm: draft.heightCm,
      areaM2: live.areaM2,
      billableAreaM2: live.billableAreaM2,
      lineaId: linea.id,
      lineaLabel: linea.label,
      acabadoId: acabado.id,
      acabadoLabel: acabado.label,
      vidrioId: vidrio.id,
      vidrioLabel: vidrio.label,
      herrajeIds: draft.herrajeIds,
      herrajeLabels: draft.herrajeIds.map((id) => getById(HERRAJES, id).label),
      quantity: draft.quantity,
      unitPrice: live.unitPrice,
      subtotal: live.unitPrice * draft.quantity,
    };

    setCart((c) => [...c, item]);
    setDraft(EMPTY_DRAFT);
  }

  function removeItem(id: string) {
    setCart((c) => c.filter((i) => i.id !== id));
  }

  function duplicateItem(id: string) {
    setCart((c) => {
      const original = c.find((i) => i.id === id);
      if (!original) return c;
      return [...c, { ...original, id: `item-${Date.now()}` }];
    });
  }

  function updateQuantity(id: string, quantity: number) {
    setCart((c) =>
      c.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity), subtotal: i.unitPrice * Math.max(1, quantity) } : i))
    );
  }

  function updateClient(patch: Partial<ClientData>) {
    setClient((c) => ({ ...c, ...patch }));
  }

  function startNewItem() {
    setDraft(EMPTY_DRAFT);
    setStep(1);
  }

  function resetAll() {
    setDraft(EMPTY_DRAFT);
    setCart([]);
    setClient(EMPTY_CLIENT);
    setIvaPercent(DEFAULT_IVA_PERCENT);
    setStep(1);
    setPreviewOpen(false);
    setSavedQuote(null);
  }

  async function generateQuote() {
    setSavingQuote(true);
    try {
      const quote = await apiFetch<{ id: string; folio: string; createdAt: string }>("/quotes", {
        method: "POST",
        body: JSON.stringify({
          clientName: client.name,
          clientPhone: client.phone,
          clientEmail: client.email || "sin-correo@elcercho.mx",
          clientAddress: client.address,
          clientPostalCode: client.postalCode,
          ivaPercent,
          items: cart.map((item) => ({
            categoryId: item.categoryId,
            categoryLabel: item.categoryLabel,
            subtypeLabel: item.subtypeLabel,
            widthCm: item.widthCm,
            heightCm: item.heightCm,
            lineaId: item.lineaId,
            acabadoId: item.acabadoId,
            vidrioId: item.vidrioId,
            herrajeIds: item.herrajeIds,
            quantity: item.quantity,
          })),
        }),
      });
      setSavedQuote({ id: quote.id, folio: quote.folio, createdAt: quote.createdAt });
      setPreviewOpen(true);
    } finally {
      setSavingQuote(false);
    }
  }

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, i) => sum + i.subtotal, 0);
    const iva = Math.round(subtotal * (ivaPercent / 100));
    return { subtotal, iva, total: subtotal + iva };
  }, [cart, ivaPercent]);

  return {
    step,
    setStep,
    draft,
    category,
    live,
    cart,
    client,
    ivaPercent,
    setIvaPercent,
    previewOpen,
    setPreviewOpen,
    savedQuote,
    savingQuote,
    totals,
    selectProduct,
    updateDraft,
    toggleHerraje,
    confirmDraftToCart,
    removeItem,
    duplicateItem,
    updateQuantity,
    updateClient,
    startNewItem,
    resetAll,
    generateQuote,
  };
}
