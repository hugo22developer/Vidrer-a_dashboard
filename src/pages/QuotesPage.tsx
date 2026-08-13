import { AnimatePresence, motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { WizardSteps } from "@/components/quotes/WizardSteps";
import { Step1Product } from "@/components/quotes/Step1Product";
import { Step2Configure } from "@/components/quotes/Step2Configure";
import { Step3Cart } from "@/components/quotes/Step3Cart";
import { Step4Client } from "@/components/quotes/Step4Client";
import { QuotePreviewModal } from "@/components/quotes/QuotePreviewModal";
import { useQuoteBuilder } from "@/hooks/useQuoteBuilder";

export function QuotesPage() {
  const qb = useQuoteBuilder();

  return (
    <div>
      <PageHeader
        eyebrow="Ventas"
        title="Gestión de Cotizaciones"
        description="Configurador interactivo: arma una cotización partida por partida y genera la hoja formal para el cliente."
      />

      <WizardSteps current={qb.step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={qb.step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {qb.step === 1 && <Step1Product onSelect={qb.selectProduct} />}

          {qb.step === 2 && qb.category && (
            <Step2Configure
              category={qb.category}
              draft={qb.draft}
              live={qb.live}
              onChange={qb.updateDraft}
              onToggleHerraje={qb.toggleHerraje}
              onBack={() => qb.setStep(1)}
              onContinue={() => qb.setStep(3)}
            />
          )}

          {qb.step === 3 && (
            <Step3Cart
              draft={qb.draft}
              live={qb.live}
              hasPendingDraft={!!qb.draft.categoryId}
              cart={qb.cart}
              onConfirmDraft={qb.confirmDraftToCart}
              onAddAnother={qb.startNewItem}
              onRemove={qb.removeItem}
              onDuplicate={qb.duplicateItem}
              onQuantityChange={qb.updateQuantity}
              onBack={() => qb.setStep(qb.draft.categoryId ? 2 : 1)}
              onContinue={() => qb.setStep(4)}
            />
          )}

          {qb.step === 4 && (
            <Step4Client
              client={qb.client}
              onChange={qb.updateClient}
              onBack={() => qb.setStep(3)}
              onGenerate={qb.generateQuote}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <QuotePreviewModal
        open={qb.previewOpen}
        onClose={() => qb.setPreviewOpen(false)}
        client={qb.client}
        cart={qb.cart}
        ivaPercent={qb.ivaPercent}
        onIvaChange={qb.setIvaPercent}
        totals={qb.totals}
        onReset={qb.resetAll}
        quoteMeta={qb.savedQuote}
      />
    </div>
  );
}
