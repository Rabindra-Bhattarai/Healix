"use client";

import { FormEvent, useState } from "react";
import Portal from "@/components/ui/Portal";
import { createVaultReport, LabFlag, LabResultRow } from "@/lib/vault";
import { VAULT_CATEGORIES, VaultCategory, VITAL_METRICS, getVaultCategoryFields } from "@/lib/vaultCategories";
import { ApiError } from "@/lib/api";

const FLAGS: LabFlag[] = ["NORMAL", "HIGH", "LOW", "OPTIMAL"];

function emptyRow(defaultTestName = ""): LabResultRow {
  return { testName: defaultTestName, result: "", flag: "NORMAL", referenceRange: "", units: "" };
}

interface VitalEntry {
  checked: boolean;
  value: string;
  units: string;
  range: string;
  flag: LabFlag;
}

function initialVitalEntries(): Record<string, VitalEntry> {
  return Object.fromEntries(
    VITAL_METRICS.map((m) => [
      m.name,
      { checked: false, value: "", units: m.defaultUnits, range: m.defaultRange, flag: "NORMAL" as LabFlag },
    ])
  );
}

export default function AddVaultReportModal({
  patientId,
  patientName,
  onClose,
  onCreated,
}: {
  patientId: string;
  patientName: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<VaultCategory>(VAULT_CATEGORIES[0]);
  const [status, setStatus] = useState<"Ready" | "Pending">("Ready");
  const [rows, setRows] = useState<LabResultRow[]>([]);
  const [vitalEntries, setVitalEntries] = useState<Record<string, VitalEntry>>(initialVitalEntries);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(false);

  const fields = getVaultCategoryFields(category);
  const isVitals = category === "Vitals";

  function updateRow(index: number, patch: Partial<LabResultRow>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function updateVital(name: string, patch: Partial<VitalEntry>) {
    setVitalEntries((prev) => ({ ...prev, [name]: { ...prev[name], ...patch } }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    let results: LabResultRow[];

    if (isVitals) {
      const checked = Object.entries(vitalEntries).filter(([, v]) => v.checked);
      if (checked.length === 0) {
        setError("Select at least one vital to record.");
        return;
      }
      const missingValue = checked.find(([, v]) => !v.value.trim());
      if (missingValue) {
        setError(`Enter a value for ${missingValue[0]}.`);
        return;
      }
      results = checked.map(([name, v]) => ({
        testName: name,
        result: v.value.trim(),
        flag: v.flag,
        referenceRange: v.range,
        units: v.units,
      }));
    } else {
      const filledRows = rows.filter(
        (r) => r.result.trim() || r.referenceRange.trim() || r.units.trim() || r.testName.trim()
      );
      const missingName = filledRows.find((r) => !r.testName.trim());
      if (missingName) {
        setError(`Please select a ${fields.columns.testName.toLowerCase()} for every row you've started filling in.`);
        return;
      }
      results = filledRows;
    }

    setSaving(true);
    try {
      await createVaultReport({ patientId, title, category, status, results });
      onCreated();
      setCreated(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (created) {
    return (
      <Portal>
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-md px-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <span className="material-symbols-outlined text-secondary text-5xl">
                check_circle
              </span>
              <p className="font-bold text-on-surface">Report added</p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {patientName} can now see &quot;{title}&quot; in their Medical Vault, and they&apos;ve
                been notified.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Portal>
    );
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-md px-4">
        <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
            <h3 className="font-h3 text-h3 text-on-surface">Add Report for {patientName}</h3>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-error transition-colors p-1"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {error && (
              <p className="font-label-sm text-label-sm text-error bg-error-container/50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Blood Panel Results"
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-outline">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as VaultCategory);
                    setRows([]);
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
                >
                  {VAULT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-outline">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Ready" | "Pending")}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md bg-white"
                >
                  <option value="Ready">Ready</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {isVitals ? (
              <div className="space-y-2">
                <label className="font-label-sm text-label-sm text-outline">
                  Vitals — check the ones you measured
                </label>
                {VITAL_METRICS.map((metric) => {
                  const entry = vitalEntries[metric.name];
                  return (
                    <div
                      key={metric.name}
                      className={`border rounded-lg p-3 space-y-2 transition-colors ${
                        entry.checked ? "border-primary/40 bg-primary/5" : "border-outline-variant/30"
                      }`}
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={entry.checked}
                          onChange={(e) => updateVital(metric.name, { checked: e.target.checked })}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          {metric.icon}
                        </span>
                        <span className="font-body-md text-body-md font-medium text-on-surface">
                          {metric.name}
                        </span>
                      </label>
                      {entry.checked && (
                        <div className="grid grid-cols-3 gap-2 pl-6">
                          <input
                            value={entry.value}
                            onChange={(e) => updateVital(metric.name, { value: e.target.value })}
                            placeholder="Value"
                            autoFocus
                            className="px-3 py-1.5 rounded-lg border border-outline-variant text-body-md font-body-md bg-white"
                          />
                          <input
                            value={entry.units}
                            onChange={(e) => updateVital(metric.name, { units: e.target.value })}
                            placeholder="Units"
                            className="px-3 py-1.5 rounded-lg border border-outline-variant text-body-md font-body-md bg-white text-on-surface-variant"
                          />
                          <select
                            value={entry.flag}
                            onChange={(e) => updateVital(metric.name, { flag: e.target.value as LabFlag })}
                            className="px-3 py-1.5 rounded-lg border border-outline-variant text-body-md font-body-md bg-white"
                          >
                            {FLAGS.map((f) => (
                              <option key={f} value={f}>
                                {f}
                              </option>
                            ))}
                          </select>
                          <input
                            value={entry.range}
                            onChange={(e) => updateVital(metric.name, { range: e.target.value })}
                            placeholder="Normal range"
                            className="col-span-3 px-3 py-1.5 rounded-lg border border-outline-variant text-body-md font-body-md bg-white text-on-surface-variant"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm text-label-sm text-outline">
                    {fields.rowLabel} Details (optional)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setRows((prev) => [...prev, emptyRow(fields.presetTestNames?.[0] ?? "")])
                    }
                    className="font-label-sm text-label-sm text-primary hover:underline"
                  >
                    {fields.addButtonLabel}
                  </button>
                </div>
                {rows.map((row, i) => (
                  <div key={i} className="border border-outline-variant/30 rounded-lg p-3 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 text-on-surface-variant hover:text-error"
                      aria-label={`Remove ${fields.rowLabel.toLowerCase()}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                    {fields.presetTestNames ? (
                      <select
                        value={row.testName}
                        onChange={(e) => updateRow(i, { testName: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-body-md font-body-md bg-white"
                      >
                        <option value="">Select {fields.columns.testName.toLowerCase()}...</option>
                        {fields.presetTestNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={row.testName}
                        onChange={(e) => updateRow(i, { testName: e.target.value })}
                        placeholder={fields.columns.testName}
                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-body-md font-body-md bg-white"
                      />
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        value={row.result}
                        onChange={(e) => updateRow(i, { result: e.target.value })}
                        placeholder={fields.columns.result}
                        className="px-3 py-1.5 rounded-lg border border-outline-variant text-body-md font-body-md bg-white"
                      />
                      <input
                        value={row.referenceRange}
                        onChange={(e) => updateRow(i, { referenceRange: e.target.value })}
                        placeholder={fields.columns.referenceRange}
                        className="px-3 py-1.5 rounded-lg border border-outline-variant text-body-md font-body-md bg-white"
                      />
                      <input
                        value={row.units}
                        onChange={(e) => updateRow(i, { units: e.target.value })}
                        placeholder={fields.columns.units}
                        className="px-3 py-1.5 rounded-lg border border-outline-variant text-body-md font-body-md bg-white"
                      />
                    </div>
                    {fields.showFlag && (
                      <select
                        value={row.flag}
                        onChange={(e) => updateRow(i, { flag: e.target.value as LabFlag })}
                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant text-body-md font-body-md bg-white"
                      >
                        {FLAGS.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            )}
          </form>

          <div className="px-6 py-4 bg-surface-container-low flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg font-label-sm text-label-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !title.trim()}
              className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-colors shadow-sm disabled:opacity-60"
            >
              {saving ? "Adding..." : "Add Report"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
