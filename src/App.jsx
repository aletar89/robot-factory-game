import { useMemo, useState } from 'react';
import PartNode from './components/PartNode.jsx';

const blueprints = {
  robot: {
    id: 'robot',
    name: 'Factory Robot',
    description: 'A general-purpose assembly robot ready to join the production line.',
    buyCost: 7500,
    salePrice: 6200,
    researchCost: 0,
    requirements: {
      frameAssembly: 1,
      powertrain: 1,
      controlCore: 1,
      mobilityRig: 1,
    },
  },
  frameAssembly: {
    id: 'frameAssembly',
    name: 'Frame Assembly',
    description: 'Structural chassis with wiring to mount subsystems.',
    buyCost: 1150,
    salePrice: 950,
    researchCost: 300,
    requirements: {
      frameShell: 1,
      fastenerKit: 2,
      wiringHarness: 1,
    },
  },
  powertrain: {
    id: 'powertrain',
    name: 'Powertrain',
    description: 'Energy delivery and cooling to keep robots running.',
    buyCost: 1500,
    salePrice: 1250,
    researchCost: 320,
    requirements: {
      batteryArray: 1,
      powerBus: 1,
      coolingLoop: 1,
    },
  },
  controlCore: {
    id: 'controlCore',
    name: 'Control Core',
    description: 'Brains, sensors, and firmware bundle.',
    buyCost: 1400,
    salePrice: 1050,
    researchCost: 320,
    requirements: {
      controllerBoard: 1,
      sensorSuite: 1,
    },
  },
  mobilityRig: {
    id: 'mobilityRig',
    name: 'Mobility Rig',
    description: 'Actuation system with balance and locomotion.',
    buyCost: 1500,
    salePrice: 1250,
    researchCost: 280,
    requirements: {
      armature: 1,
      locomotionKit: 1,
      balanceModule: 1,
    },
  },
  batteryArray: {
    id: 'batteryArray',
    name: 'Battery Array',
    description: 'Stacked cells and plating for long-life power.',
    buyCost: 650,
    salePrice: 420,
    researchCost: 180,
    requirements: {
      cellStack: 2,
      platingKit: 1,
    },
  },
  controllerBoard: {
    id: 'controllerBoard',
    name: 'Controller Board',
    description: 'Processor board with IO shielding.',
    buyCost: 600,
    salePrice: 450,
    researchCost: 180,
    requirements: {
      logicChips: 2,
      ioShield: 1,
    },
  },
  armature: {
    id: 'armature',
    name: 'Armature',
    description: 'Servo-driven manipulators ready for tooling.',
    buyCost: 700,
    salePrice: 520,
    researchCost: 200,
    requirements: {
      servoPair: 2,
      utilityClaws: 1,
    },
  },
  locomotionKit: {
    id: 'locomotionKit',
    name: 'Locomotion Kit',
    description: 'Legs and wheels for adaptable movement.',
    buyCost: 260,
    salePrice: 210,
    researchCost: 140,
    requirements: {},
  },
  balanceModule: {
    id: 'balanceModule',
    name: 'Balance Module',
    description: 'Gyros and firmware for stability.',
    buyCost: 210,
    salePrice: 170,
    researchCost: 140,
    requirements: {},
  },
  powerBus: {
    id: 'powerBus',
    name: 'Power Bus',
    description: 'High-current distribution harness.',
    buyCost: 210,
    salePrice: 170,
    researchCost: 140,
    requirements: {},
  },
  coolingLoop: {
    id: 'coolingLoop',
    name: 'Cooling Loop',
    description: 'Liquid loop with radiator and pump.',
    buyCost: 140,
    salePrice: 120,
    researchCost: 120,
    requirements: {},
  },
  sensorSuite: {
    id: 'sensorSuite',
    name: 'Sensor Suite',
    description: 'Lidar, depth cameras, and diagnostics.',
    buyCost: 280,
    salePrice: 220,
    researchCost: 160,
    requirements: {},
  },
  frameShell: {
    id: 'frameShell',
    name: 'Frame Shell',
    description: 'Steel frame plates and bracing.',
    buyCost: 380,
    salePrice: 300,
    researchCost: 160,
    requirements: {},
  },
  fastenerKit: {
    id: 'fastenerKit',
    name: 'Fastener Kit',
    description: 'Industrial rivets and bolts.',
    buyCost: 120,
    salePrice: 95,
    researchCost: 120,
    requirements: {},
  },
  wiringHarness: {
    id: 'wiringHarness',
    name: 'Wiring Harness',
    description: 'Shielded wiring bundle with connectors.',
    buyCost: 180,
    salePrice: 150,
    researchCost: 120,
    requirements: {},
  },
  cellStack: {
    id: 'cellStack',
    name: 'Cell Stack',
    description: 'Lithium-ion cell cluster.',
    buyCost: 90,
    salePrice: 70,
    researchCost: 90,
    requirements: {},
  },
  platingKit: {
    id: 'platingKit',
    name: 'Plating Kit',
    description: 'Thermal armor and insulators.',
    buyCost: 120,
    salePrice: 95,
    researchCost: 90,
    requirements: {},
  },
  logicChips: {
    id: 'logicChips',
    name: 'Logic Chips',
    description: 'CPU clusters and memory.',
    buyCost: 110,
    salePrice: 90,
    researchCost: 90,
    requirements: {},
  },
  ioShield: {
    id: 'ioShield',
    name: 'IO Shield',
    description: 'EMI protected IO backplane.',
    buyCost: 90,
    salePrice: 70,
    researchCost: 90,
    requirements: {},
  },
  servoPair: {
    id: 'servoPair',
    name: 'Servo Pair',
    description: 'Matched servos for precision movement.',
    buyCost: 140,
    salePrice: 110,
    researchCost: 120,
    requirements: {},
  },
  utilityClaws: {
    id: 'utilityClaws',
    name: 'Utility Claws',
    description: 'Quick-swap grippers and clamps.',
    buyCost: 100,
    salePrice: 80,
    researchCost: 120,
    requirements: {},
  },
};

const initialState = () => {
  const entries = {};
  Object.keys(blueprints).forEach((id) => {
    entries[id] = {
      unlocked: id === 'robot',
      inventory: 0,
      purchaseRate: 0,
      sellThreshold: 0,
    };
  });
  return entries;
};

function App() {
  const [funds, setFunds] = useState(5000);
  const [parts, setParts] = useState(initialState);

  const unlockableParts = useMemo(() => new Set(Object.keys(blueprints)), []);

  const handleResearch = (id) => {
    const blueprint = blueprints[id];
    if (!unlockableParts.has(id)) return;
    if (parts[id].unlocked) return;
    if (funds < blueprint.researchCost) return;

    setFunds((previous) => previous - blueprint.researchCost);
    setParts((previous) => ({
      ...previous,
      [id]: { ...previous[id], unlocked: true },
    }));
  };

  const handleOrder = (id) => {
    const blueprint = blueprints[id];
    if (!parts[id].unlocked) return;
    if (funds < blueprint.buyCost) return;

    setFunds((previous) => previous - blueprint.buyCost);
    setParts((previous) => ({
      ...previous,
      [id]: { ...previous[id], inventory: previous[id].inventory + 1 },
    }));
  };

  const canAssemble = (id) => {
    const blueprint = blueprints[id];
    const requirements = Object.entries(blueprint.requirements);
    if (!requirements.length) return false;
    return requirements.every(([reqId, qty]) => parts[reqId]?.inventory >= qty);
  };

  const handleAssemble = (id) => {
    if (!parts[id].unlocked) return;
    if (!canAssemble(id)) return;

    setParts((previous) => {
      const next = { ...previous };
      const blueprint = blueprints[id];
      Object.entries(blueprint.requirements).forEach(([reqId, qty]) => {
        next[reqId] = {
          ...next[reqId],
          inventory: Math.max(0, next[reqId].inventory - qty),
        };
      });
      next[id] = {
        ...next[id],
        inventory: next[id].inventory + 1,
      };
      return next;
    });
  };

  const handleSell = (id) => {
    if (parts[id].inventory < 1) return;
    const blueprint = blueprints[id];
    setParts((previous) => ({
      ...previous,
      [id]: { ...previous[id], inventory: previous[id].inventory - 1 },
    }));
    setFunds((previous) => previous + blueprint.salePrice);
  };

  const simulateAutomationCycle = (currentParts, currentFunds) => {
    const nextParts = Object.entries(currentParts).reduce((acc, [id, state]) => {
      acc[id] = { ...state };
      return acc;
    }, {});

    let availableFunds = currentFunds;
    const rows = [];

    Object.values(blueprints).forEach((blueprint) => {
      const state = nextParts[blueprint.id];
      if (!state.unlocked) return;

      let spent = 0;
      let earned = 0;

      if (state.purchaseRate > 0 && availableFunds > 0) {
        const affordable = Math.min(
          state.purchaseRate,
          Math.floor(availableFunds / blueprint.buyCost),
        );

        if (affordable > 0) {
          spent = affordable * blueprint.buyCost;
          availableFunds -= spent;
          state.inventory += affordable;
        }
      }

      if (state.sellThreshold >= 0 && state.inventory > state.sellThreshold) {
        const sellable = state.inventory - state.sellThreshold;
        earned = sellable * blueprint.salePrice;
        availableFunds += earned;
        state.inventory -= sellable;
      }

      rows.push({
        id: blueprint.id,
        name: blueprint.name,
        buyCost: blueprint.buyCost,
        salePrice: blueprint.salePrice,
        purchaseRate: state.purchaseRate,
        sellThreshold: state.sellThreshold,
        spent,
        earned,
        net: earned - spent,
      });
    });

    const totalNet = rows.reduce((total, { net }) => total + net, 0);

    return { rows, totalNet, resultingParts: nextParts, resultingFunds: availableFunds };
  };

  const handleAutomationTick = () => {
    const { resultingParts, resultingFunds } = simulateAutomationCycle(parts, funds);
    setParts(resultingParts);
    setFunds(resultingFunds);
  };

  const handlePurchaseRateChange = (id, value) => {
    const rate = Math.max(0, Number.parseInt(value, 10) || 0);
    setParts((previous) => ({
      ...previous,
      [id]: { ...previous[id], purchaseRate: rate },
    }));
  };

  const handleSellThresholdChange = (id, value) => {
    const threshold = Math.max(0, Number.parseInt(value, 10) || 0);
    setParts((previous) => ({
      ...previous,
      [id]: { ...previous[id], sellThreshold: threshold },
    }));
  };

  const automationSummary = useMemo(
    () => simulateAutomationCycle(parts, funds),
    [funds, parts],
  );

  const renderTree = (id) => (
    <PartNode
      key={id}
      id={id}
      blueprint={blueprints[id]}
      parts={parts}
      blueprints={blueprints}
      funds={funds}
      onResearch={handleResearch}
      onOrder={handleOrder}
      onAssemble={handleAssemble}
      onSell={handleSell}
      onRateChange={handlePurchaseRateChange}
      onSellThresholdChange={handleSellThresholdChange}
      renderChild={renderTree}
      canAssemble={canAssemble}
    />
  );

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Concept pitch</p>
          <h1>Robot Factory Game</h1>
          <p className="lede">
            Grow a robotics foundry from hand-assembled prototypes to a fully automated line. Buy parts at
            a premium, research cheaper subassemblies, and sell finished robots for healthy margins.
          </p>
        </div>
        <div className="metrics">
          <div className="metric-card">
            <span className="label">Available funds</span>
            <span className="value">${funds.toLocaleString()}</span>
          </div>
          <div className="metric-card">
            <span className="label">Automation</span>
            <p className="metric-text">Set purchase rates and sell-down rules, then run a cycle to process them.</p>
            <button className="primary" type="button" onClick={handleAutomationTick}>
              Run automation cycle
            </button>
          </div>
        </div>
      </header>

      <section className="tree-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Production tree</p>
            <h2>Robots branch into parts and research nodes</h2>
            <p className="muted">Every node can be purchased outright, but researching it lets you assemble it from cheaper subparts.</p>
          </div>
        </div>
        <div className="tree-grid">{renderTree('robot')}</div>
      </section>

      <section className="summary-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Cycle outlook</p>
            <h2>Automation summary for unlocked parts</h2>
            <p className="muted">Preview expected spending and revenue before running a cycle.</p>
          </div>
        </div>

        {automationSummary.rows.length === 0 ? (
          <p className="muted">Research parts to see an automation summary.</p>
        ) : (
          <div className="summary-table" role="table" aria-label="Automation summary">
            <div className="summary-row summary-header" role="row">
              <div role="columnheader">Part</div>
              <div role="columnheader">Buy cost</div>
              <div role="columnheader">Sale price</div>
              <div role="columnheader">Purchase / cycle</div>
              <div role="columnheader">Sell down to</div>
              <div role="columnheader">Spend this cycle</div>
              <div role="columnheader">Earn this cycle</div>
              <div role="columnheader">Net change</div>
            </div>
            {automationSummary.rows.map((row) => (
              <div className="summary-row" role="row" key={row.id}>
                <div role="cell">{row.name}</div>
                <div role="cell">${row.buyCost.toLocaleString()}</div>
                <div role="cell">${row.salePrice.toLocaleString()}</div>
                <div role="cell">{row.purchaseRate}</div>
                <div role="cell">{row.sellThreshold}</div>
                <div role="cell" className="muted">-${row.spent.toLocaleString()}</div>
                <div role="cell" className="muted">+${row.earned.toLocaleString()}</div>
                <div role="cell" className={row.net >= 0 ? 'positive' : 'negative'}>
                  {row.net >= 0 ? '+' : ''}{row.net.toLocaleString()}
                </div>
              </div>
            ))}
            <div className="summary-row summary-footer" role="row">
              <div role="cell">Projected net per cycle</div>
              <div role="cell" />
              <div role="cell" />
              <div role="cell" />
              <div role="cell" />
              <div role="cell" />
              <div role="cell" />
              <div role="cell" className={automationSummary.totalNet >= 0 ? 'positive' : 'negative'}>
                {automationSummary.totalNet >= 0 ? '+' : ''}{automationSummary.totalNet.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
