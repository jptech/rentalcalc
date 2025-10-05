import { useState } from 'react';
import { X, Edit2, Trash2, Plus, Check } from 'lucide-react';
import type { SavedScenario } from '../../types/scenario';
import type { PropertyInputs } from '../../types/property';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ScenarioManagerProps {
  scenarios: SavedScenario[];
  onClose: () => void;
  onSave: (name: string, inputs: PropertyInputs) => void;
  onUpdate: (id: string, updates: Partial<SavedScenario>) => void;
  onDelete: (id: string) => void;
  onLoad: (scenario: SavedScenario) => void;
  onCompare: (scenarioIds: string[]) => void;
  currentInputs: PropertyInputs;
}

export function ScenarioManager({
  scenarios,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  onLoad,
  onCompare,
  currentInputs,
}: ScenarioManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newScenarioName, setNewScenarioName] = useState('');
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  const handleStartEdit = (scenario: SavedScenario) => {
    setEditingId(scenario.id);
    setEditName(scenario.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      onUpdate(id, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete scenario "${name}"?`)) {
      onDelete(id);
      setSelectedForComparison(prev => prev.filter(sid => sid !== id));
    }
  };

  const handleSaveNew = () => {
    if (newScenarioName.trim()) {
      onSave(newScenarioName.trim(), currentInputs);
      setNewScenarioName('');
    }
  };

  const toggleComparisonSelection = (id: string) => {
    setSelectedForComparison(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleCompare = () => {
    if (selectedForComparison.length >= 2) {
      onCompare(selectedForComparison);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col">
        <CardHeader className="border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle>Scenario Manager</CardTitle>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto flex-1">
          {/* Save Current as New Scenario */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Save Current Settings
            </h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter scenario name..."
                value={newScenarioName}
                onChange={e => setNewScenarioName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveNew()}
                className="flex-1"
              />
              <Button
                onClick={handleSaveNew}
                disabled={!newScenarioName.trim()}
                variant="primary"
              >
                <Plus className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>

          {/* Scenario List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Saved Scenarios ({scenarios.length})
              </h3>
              {selectedForComparison.length >= 2 && (
                <Button onClick={handleCompare} variant="primary" className="text-sm">
                  Compare Selected ({selectedForComparison.length})
                </Button>
              )}
            </div>

            {scenarios.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No saved scenarios yet. Save your current settings above.
              </div>
            ) : (
              scenarios.map(scenario => (
                <div
                  key={scenario.id}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedForComparison.includes(scenario.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Checkbox for comparison selection */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedForComparison.includes(scenario.id)}
                        onChange={() => toggleComparisonSelection(scenario.id)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />

                      <div className="flex-1 min-w-0">
                        {editingId === scenario.id ? (
                          <div className="flex gap-2 mb-2">
                            <Input
                              type="text"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveEdit(scenario.id);
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              className="flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(scenario.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <h4 className="font-semibold text-slate-900 mb-1 truncate">
                            {scenario.name}
                          </h4>
                        )}
                        <div className="text-xs text-slate-500">
                          Updated {new Date(scenario.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {editingId !== scenario.id && (
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => onLoad(scenario)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Load scenario"
                        >
                          <span className="text-xs font-medium">Load</span>
                        </button>
                        <button
                          onClick={() => handleStartEdit(scenario)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                          title="Edit name"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(scenario.id, scenario.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete scenario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {scenarios.length > 1 && (
            <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-600">
              <strong>Tip:</strong> Select 2 or more scenarios to compare them side-by-side
            </div>
          )}
        </CardContent>

        <div className="border-t p-4 flex justify-end flex-shrink-0">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
