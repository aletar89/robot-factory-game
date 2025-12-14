import PropTypes from 'prop-types';

function PartNode({
  id,
  blueprint,
  parts,
  blueprints,
  funds,
  onResearch,
  onOrder,
  onAssemble,
  onSell,
  onRateChange,
  onSellThresholdChange,
  renderChild,
  canAssemble,
}) {
  const state = parts[id];
  const childIds = Object.keys(blueprint.requirements || {});
  const requirements = childIds.map((childId) => ({
    id: childId,
    qty: blueprint.requirements[childId],
  }));

  const buildCost = requirements.reduce(
    (total, { id: childId, qty }) => total + blueprints[childId].buyCost * qty,
    0,
  );

  return (
    <div className="node-card">
      <div className="node-head">
        <div>
          <p className="eyebrow">{state.unlocked ? 'Unlocked' : 'Research required'}</p>
          <h3>{blueprint.name}</h3>
          <p className="muted">{blueprint.description}</p>
        </div>
        <div className="price-block">
          <div>
            <p className="label">Buy price (premium)</p>
            <p className="value">${blueprint.buyCost}</p>
          </div>
          <div>
            <p className="label">Sale price</p>
            <p className="value">${blueprint.salePrice}</p>
          </div>
          {requirements.length > 0 && (
            <div>
              <p className="label">Parts cost to build</p>
              <p className="value">${buildCost}</p>
            </div>
          )}
        </div>
      </div>

      <div className="controls">
        {!state.unlocked && (
          <button
            className="primary"
            type="button"
            disabled={funds < blueprint.researchCost}
            onClick={() => onResearch(id)}
          >
            Research for ${blueprint.researchCost}
          </button>
        )}
        {state.unlocked && (
          <div className="control-row">
            <button
              className="secondary"
              type="button"
              disabled={funds < blueprint.buyCost}
              onClick={() => onOrder(id)}
            >
              Buy at premium
            </button>
            {requirements.length > 0 && (
              <button
                className="primary"
                type="button"
                disabled={!canAssemble(id)}
                onClick={() => onAssemble(id)}
              >
                Assemble from parts
              </button>
            )}
            <button
              className="ghost"
              type="button"
              disabled={state.inventory < 1}
              onClick={() => onSell(id)}
            >
              Sell one
            </button>
          </div>
        )}
      </div>

      <div className="inventories">
        <div>
          <p className="label">Inventory</p>
          <p className="value">{state.inventory}</p>
        </div>
        <div>
          <label className="label" htmlFor={`${id}-purchase`}>
            Purchase rate / cycle
          </label>
          <input
            id={`${id}-purchase`}
            type="number"
            min="0"
            value={state.purchaseRate}
            onChange={(event) => onRateChange(id, event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor={`${id}-sell`}>
            Sell down to
          </label>
          <input
            id={`${id}-sell`}
            type="number"
            min="0"
            value={state.sellThreshold}
            onChange={(event) => onSellThresholdChange(id, event.target.value)}
          />
        </div>
      </div>

      {requirements.length > 0 && (
        <div className="requirements">
          <p className="label">Requires</p>
          <ul>
            {requirements.map(({ id: childId, qty }) => (
              <li key={childId}>
                <span className="muted">{qty}x</span> {blueprints[childId].name} — owned: {parts[childId].inventory}
              </li>
            ))}
          </ul>
        </div>
      )}

      {requirements.length > 0 && (
        <div className="children">
          {requirements.map(({ id: childId }) => renderChild(childId))}
        </div>
      )}
    </div>
  );
}

PartNode.propTypes = {
  id: PropTypes.string.isRequired,
  blueprint: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    buyCost: PropTypes.number.isRequired,
    salePrice: PropTypes.number.isRequired,
    researchCost: PropTypes.number.isRequired,
    requirements: PropTypes.objectOf(PropTypes.number).isRequired,
  }).isRequired,
  parts: PropTypes.objectOf(
    PropTypes.shape({
      unlocked: PropTypes.bool.isRequired,
      inventory: PropTypes.number.isRequired,
      purchaseRate: PropTypes.number.isRequired,
      sellThreshold: PropTypes.number.isRequired,
    }),
  ).isRequired,
  blueprints: PropTypes.object.isRequired,
  funds: PropTypes.number.isRequired,
  onResearch: PropTypes.func.isRequired,
  onOrder: PropTypes.func.isRequired,
  onAssemble: PropTypes.func.isRequired,
  onSell: PropTypes.func.isRequired,
  onRateChange: PropTypes.func.isRequired,
  onSellThresholdChange: PropTypes.func.isRequired,
  renderChild: PropTypes.func.isRequired,
  canAssemble: PropTypes.func.isRequired,
};

export default PartNode;
