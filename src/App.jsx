export default function App() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "var(--sp-6)",
        background: "var(--grad-hero), var(--bg-base)",
      }}
    >
      <section
        className="u-container u-stack-lg u-text-center a-slide-up"
        aria-labelledby="momentum-title"
      >
        <p className="t-micro">Building Momentum · Week 1 · Day 1</p>

        <h1 id="momentum-title" className="t-display-lg t-gradient">
          Momentum
        </h1>

        <p className="t-body u-text-secondary">
          Small habits. Real momentum.
        </p>

        <div
          className="u-inline-flex u-items-center u-gap-2 u-px-4 u-py-4 u-surface"
          style={{
            borderRadius: "var(--radius-pill)",
            paddingBlock: "var(--sp-2)",
          }}
        >
          <span
            className="a-breathe"
            style={{
              width: 8,
              height: 8,
              borderRadius: "var(--radius-pill)",
              background: "var(--brand-500)",
              boxShadow: "var(--shadow-glow)",
            }}
            aria-hidden="true"
          />
          <span className="t-small u-text-primary">
            Foundation ready — tokens, typography, motion online
          </span>
        </div>
      </section>
    </main>
  );
}