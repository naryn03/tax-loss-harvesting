import { useState, useEffect, useMemo, createContext, useContext } from "react";

// ─── Mock API ────────────────────────────────────────────────────────────────
const fetchCapitalGains = () =>
  new Promise((res) =>
    setTimeout(
      () =>
        res({
          capitalGains: {
            stcg: { profits: 70200.88, losses: 1548.53 },
            ltcg: { profits: 5020, losses: 3050 },
          },
        }),
      600
    )
  );

const HOLDINGS_DATA = [
  { coin: "ETH", coinName: "Ethereum", logo: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628", currentPrice: 216182, totalHolding: 0.0004211938732637162, averageBuyPrice: 3909.792264648455, stcg: { balance: 0.0004211938732637162, gain: 89.40775336229291 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "WETH", coinName: "Polygon PoS Bridged WETH", logo: "https://coin-images.coingecko.com/coins/images/2518/large/weth.png?1696503332", currentPrice: 211756, totalHolding: 0.00023999998390319965, averageBuyPrice: 3599.856066001555, stcg: { balance: 0.00023999998390319965, gain: 49.957471193511736 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "MATIC", coinName: "Polygon", logo: "https://coin-images.coingecko.com/coins/images/4713/large/polygon.png?1698233745", currentPrice: 22.22, totalHolding: 2.75145540184285, averageBuyPrice: 0.6880274617804887, stcg: { balance: 2.75145540184285, gain: 59.244262152615974 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "WPOL", coinName: "Wrapped POL", logo: "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg", currentPrice: 22.08, totalHolding: 2.3172764293128694, averageBuyPrice: 0.5227311370876341, stcg: { balance: 1.3172764293128694, gain: 49.954151016387065 }, ltcg: { balance: 1, gain: 20 } },
  { coin: "GONE", coinName: "Gone", logo: "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg", currentPrice: 0.0001462, totalHolding: 696324.3075326696, averageBuyPrice: 0.00001637624055112482, stcg: { balance: 696324.3075326696, gain: 90.39943939952589 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "SOL", coinName: "SOL (Wormhole)", logo: "https://coin-images.coingecko.com/coins/images/22876/large/SOL_wh_small.png?1696522175", currentPrice: 14758.01, totalHolding: 3.469446951953614e-17, averageBuyPrice: 221.42847548590152, stcg: { balance: 3.469446951953614e-17, gain: 5.043389846205066e-13 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "FTM", coinName: "Fantom", logo: "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg", currentPrice: 52.99, totalHolding: 0.04265758808550148, averageBuyPrice: 1.7040326829291739, stcg: { balance: 0.04265758808550148, gain: 2.1877356683780986 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "LINK", coinName: "Chainlink", logo: "https://coin-images.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1696502009", currentPrice: 1450.14, totalHolding: 0.000047233224826389, averageBuyPrice: 9.172984515948809, stcg: { balance: 0.000047233224826389, gain: 0.06806151900976895 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "OX", coinName: "OX Coin", logo: "https://coin-images.coingecko.com/coins/images/35365/large/logo.png?1708395976", currentPrice: 0.13319, totalHolding: 5, averageBuyPrice: 0.018408606024462898, stcg: { balance: 5, gain: 0.5739069698776855 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "USDC", coinName: "USDC", logo: "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694", currentPrice: 85.41, totalHolding: 0.0015339999999994802, averageBuyPrice: 1.5863185433764244, stcg: { balance: 0.0015339999999994802, gain: 0.12858552735441697 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "USDC", coinName: "Bridged USDC (Polygon PoS Bridge)", logo: "https://coin-images.coingecko.com/coins/images/33000/large/usdc.png?1700119918", currentPrice: 85.41, totalHolding: 0.005806999999992795, averageBuyPrice: 1.5405071277176852, stcg: { balance: 0.005806999999992795, gain: 0.48703014510873915 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "USDT", coinName: "Arbitrum Bridged USDT", logo: "https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661", currentPrice: 85.42, totalHolding: 0.0001580000000558357, averageBuyPrice: 1.4988059369185402, stcg: { balance: 0.0001580000000558357, gain: 0.01325954866665267 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "WELT", coinName: "Fabwelt", logo: "https://coin-images.coingecko.com/coins/images/20505/large/welt.PNG?1696519911", currentPrice: 0.060863, totalHolding: 1.063542780948968, averageBuyPrice: 0.01520546569793174, stcg: { balance: 1.063542780948968, gain: 0.048558741002894576 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "SLN", coinName: "Smart Layer Network", logo: "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg", currentPrice: 6.66, totalHolding: 0.01, averageBuyPrice: 4.999247835735738, stcg: { balance: 0.01, gain: 0.016607521642642627 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "$CULO", coinName: "CULO", logo: "https://coin-images.coingecko.com/coins/images/34662/large/CULO-logo-inverted_200.png?1705641744", currentPrice: 0.00001623, totalHolding: 150000, averageBuyPrice: 0, stcg: { balance: 150000, gain: 2.4345 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "PIG", coinName: "Pigcoin", logo: "https://coin-images.coingecko.com/coins/images/35425/large/pigcoin_200.png?1708544734", currentPrice: 0.00008706, totalHolding: 1.79, averageBuyPrice: 0, stcg: { balance: 1.79, gain: 0.0001558374 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "EZ", coinName: "EasyFi V2", logo: "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg", currentPrice: 0.885074, totalHolding: 0.0005424384664524931, averageBuyPrice: 6.539367177529248, stcg: { balance: 0.0005424384664524931, gain: -0.0030671061200917595 }, ltcg: { balance: 0, gain: 0 } },
  { coin: "SPHERE", coinName: "Sphere Finance", logo: "https://coin-images.coingecko.com/coins/images/24424/large/2iR2JsL.png?1696523606", currentPrice: 0.00729945, totalHolding: 2.2737367544323206e-13, averageBuyPrice: 0.011065778585432803, stcg: { balance: 2.2737367544323206e-13, gain: -8.563639733967655e-16 }, ltcg: { balance: 0, gain: 0 } },
];

const fetchHoldings = () =>
  new Promise((res) => setTimeout(() => res(HOLDINGS_DATA), 800));

// ─── Context ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(n);

const fmtCoin = (n) => {
  if (Math.abs(n) < 1e-6) return n.toExponential(3);
  if (Math.abs(n) < 0.01) return n.toFixed(6);
  return n.toFixed(4);
};

const GainPill = ({ value }) => {
  const isPos = value >= 0;
  return (
    <span className={`gain-pill ${isPos ? "pos" : "neg"}`}>
      {isPos ? "▲" : "▼"} ₹{fmt(Math.abs(value))}
    </span>
  );
};

// ─── Capital Gains Card ───────────────────────────────────────────────────────
const GainsCard = ({ title, gains, savings, dark }) => {
  const stNet = gains.stcg.profits - gains.stcg.losses;
  const ltNet = gains.ltcg.profits - gains.ltcg.losses;
  const realised = stNet + ltNet;

  return (
    <div className={`gains-card ${dark ? "dark" : "blue"}`}>
      <div className="card-header">
        <h3>{title}</h3>
        {savings > 0 && (
          <div className="savings-badge">
            🎉 You save <strong>₹{fmt(savings)}</strong>
          </div>
        )}
      </div>

      <div className="gains-grid">
        <div className="gains-col">
          <div className="col-label">Short-term</div>
          <div className="gains-row">
            <span>Profits</span>
            <span className="val pos">₹{fmt(gains.stcg.profits)}</span>
          </div>
          <div className="gains-row">
            <span>Losses</span>
            <span className="val neg">-₹{fmt(gains.stcg.losses)}</span>
          </div>
          <div className="gains-row net">
            <span>Net Gains</span>
            <span className={`val ${stNet >= 0 ? "pos" : "neg"}`}>
              {stNet < 0 ? "-" : ""}₹{fmt(Math.abs(stNet))}
            </span>
          </div>
        </div>

        <div className="divider-v" />

        <div className="gains-col">
          <div className="col-label">Long-term</div>
          <div className="gains-row">
            <span>Profits</span>
            <span className="val pos">₹{fmt(gains.ltcg.profits)}</span>
          </div>
          <div className="gains-row">
            <span>Losses</span>
            <span className="val neg">-₹{fmt(gains.ltcg.losses)}</span>
          </div>
          <div className="gains-row net">
            <span>Net Gains</span>
            <span className={`val ${ltNet >= 0 ? "pos" : "neg"}`}>
              {ltNet < 0 ? "-" : ""}₹{fmt(Math.abs(ltNet))}
            </span>
          </div>
        </div>
      </div>

      <div className="realised-row">
        <span>Realised Capital Gains</span>
        <span className={`realised-val ${realised >= 0 ? "pos" : "neg"}`}>
          {realised < 0 ? "-" : ""}₹{fmt(Math.abs(realised))}
        </span>
      </div>
    </div>
  );
};

// ─── Holdings Table ───────────────────────────────────────────────────────────
const HoldingsTable = () => {
  const { holdings, selected, toggleAll, toggleRow, showAll, setShowAll } = useApp();
  const allSelected = selected.size === holdings.length && holdings.length > 0;
  const someSelected = selected.size > 0 && selected.size < holdings.length;
  const visible = showAll ? holdings : holdings.slice(0, 7);

  return (
    <div className="table-section">
      <div className="table-header-row">
        <h3 className="table-title">Holdings</h3>
        <span className="selected-count">
          {selected.size > 0 && `${selected.size} selected`}
        </span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>
                <label className="cb-wrap">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => el && (el.indeterminate = someSelected)}
                    onChange={toggleAll}
                  />
                  <span className="cb-custom" />
                </label>
              </th>
              <th>Asset</th>
              <th>Holdings / Avg Buy Price</th>
              <th>Current Price</th>
              <th>Short-Term Gain</th>
              <th>Long-Term Gain</th>
              <th>Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((h, i) => {
              const isSelected = selected.has(i);
              return (
                <tr
                  key={i}
                  className={isSelected ? "selected" : ""}
                  onClick={() => toggleRow(i)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <label className="cb-wrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(i)}
                      />
                      <span className="cb-custom" />
                    </label>
                  </td>
                  <td>
                    <div className="asset-cell">
                      <img
                        src={h.logo}
                        alt={h.coin}
                        onError={(e) => {
                          e.target.src =
                            "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg";
                        }}
                      />
                      <div>
                        <div className="coin-sym">{h.coin}</div>
                        <div className="coin-name">{h.coinName}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="two-line">
                      <span>{fmtCoin(h.totalHolding)} {h.coin}</span>
                      <span className="sub">₹{fmt(h.averageBuyPrice)}</span>
                    </div>
                  </td>
                  <td>₹{fmt(h.currentPrice)}</td>
                  <td>
                    <div className="two-line">
                      <GainPill value={h.stcg.gain} />
                      <span className="sub">{fmtCoin(h.stcg.balance)} {h.coin}</span>
                    </div>
                  </td>
                  <td>
                    <div className="two-line">
                      {h.ltcg.gain !== 0 || h.ltcg.balance !== 0 ? (
                        <>
                          <GainPill value={h.ltcg.gain} />
                          <span className="sub">{fmtCoin(h.ltcg.balance)} {h.coin}</span>
                        </>
                      ) : (
                        <span className="sub">—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {isSelected ? (
                      <span className="sell-amt">{fmtCoin(h.totalHolding)} {h.coin}</span>
                    ) : (
                      <span className="sub">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > 7 && (
        <button className="view-all-btn" onClick={() => setShowAll((p) => !p)}>
          {showAll ? "Show Less ▲" : `View All ${holdings.length} Holdings ▼`}
        </button>
      )}
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ w, h }) => (
  <span
    className="skeleton"
    style={{ width: w || "100%", height: h || "1rem", display: "inline-block", borderRadius: 4 }}
  />
);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [baseGains, setBaseGains] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    Promise.all([fetchCapitalGains(), fetchHoldings()]).then(([cg, h]) => {
      setBaseGains(cg.capitalGains);
      setHoldings(h);
      setLoading(false);
    });
  }, []);

  const toggleRow = (i) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === holdings.length ? new Set() : new Set(holdings.map((_, i) => i))
    );

  const afterGains = useMemo(() => {
    if (!baseGains) return null;
    let stcgP = baseGains.stcg.profits;
    let stcgL = baseGains.stcg.losses;
    let ltcgP = baseGains.ltcg.profits;
    let ltcgL = baseGains.ltcg.losses;

    selected.forEach((i) => {
      const h = holdings[i];
      if (h.stcg.gain > 0) stcgP += h.stcg.gain;
      else stcgL += Math.abs(h.stcg.gain);
      if (h.ltcg.gain > 0) ltcgP += h.ltcg.gain;
      else ltcgL += Math.abs(h.ltcg.gain);
    });

    return {
      stcg: { profits: stcgP, losses: stcgL },
      ltcg: { profits: ltcgP, losses: ltcgL },
    };
  }, [baseGains, selected, holdings]);

  const preRealised = baseGains
    ? (baseGains.stcg.profits - baseGains.stcg.losses) +
      (baseGains.ltcg.profits - baseGains.ltcg.losses)
    : 0;

  const postRealised = afterGains
    ? (afterGains.stcg.profits - afterGains.stcg.losses) +
      (afterGains.ltcg.profits - afterGains.ltcg.losses)
    : 0;

  const savings = preRealised > postRealised ? preRealised - postRealised : 0;

  return (
    <AppContext.Provider value={{ holdings, selected, toggleAll, toggleRow, showAll, setShowAll }}>
      <div className="app">
        {/* Header */}
        <header>
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span>KoinX</span>
          </div>
          <nav>
            <a href="#">Dashboard</a>
            <a href="#">Portfolio</a>
            <a href="#" className="active">Tax Tools</a>
            <a href="#">Reports</a>
          </nav>
          <button className="connect-btn">Connect Wallet</button>
        </header>

        <main>
          <div className="page-title">
            <h1>Tax Loss Harvesting</h1>
            <p>Optimise your tax liability by strategically harvesting losses from your portfolio.</p>
          </div>

          {/* Info Banner */}
          <div className="info-banner">
            <span className="info-icon">ℹ</span>
            <span>
              <strong>Important:</strong> Tax loss harvesting involves selling assets at a loss to offset capital gains.
              Consult a tax professional before making investment decisions.
            </span>
          </div>

          {/* Cards */}
          <div className="cards-row">
            {loading ? (
              <>
                <div className="gains-card dark skeleton-card">
                  <Skeleton h="1.5rem" w="60%" />
                  <br /><br />
                  <Skeleton h="8rem" />
                </div>
                <div className="gains-card blue skeleton-card">
                  <Skeleton h="1.5rem" w="60%" />
                  <br /><br />
                  <Skeleton h="8rem" />
                </div>
              </>
            ) : (
              <>
                <GainsCard title="Pre-Harvesting" gains={baseGains} dark />
                <GainsCard
                  title="After Harvesting"
                  gains={afterGains}
                  savings={savings}
                />
              </>
            )}
          </div>

          {/* Table */}
          {loading ? (
            <div className="table-section">
              <Skeleton h="20rem" />
            </div>
          ) : (
            <HoldingsTable />
          )}
        </main>

        <footer>
          <span>© 2025 KoinX · Tax Loss Harvesting Tool</span>
        </footer>
      </div>
    </AppContext.Provider>
  );
}
