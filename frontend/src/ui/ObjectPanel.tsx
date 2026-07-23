import './Toolbar.css'

export function ObjectPanel() {
  return (
    <aside className="object-panel">

      <div className="panel-section">
        <div className="panel-title">Selected</div>

        <span>Rectangle</span>
      </div>

      <div className="panel-section">
        <div className="panel-title">Actions</div>

        <button className="action-button">
          Duplicate
        </button>

        <button className="action-button">
          Bring Forward
        </button>

        <button className="action-button">
          Send Backward
        </button>

        <button className="action-button">
          Lock
        </button>

        <button className="action-button">
          Group
        </button>

        <button className="action-button danger">
          Delete
        </button>
      </div>

    </aside>
  );
}