// SystemConfigPanel.jsx
export default function SystemConfigPanel() {
  return (
    <div className="mt-4 p-4 border border-slate-700 rounded bg-slate-800 text-sm">
      <h3 className="font-semibold mb-2 text-gray-200">System Configuration</h3>
      <p className="text-gray-300 text-xs leading-relaxed">
        Placeholder panel for global system settings. Add forms here for
        toggling maintenance modes, adjusting defaults, or managing integrations.
      </p>
      <ul className="list-disc ml-5 mt-2 text-gray-400 text-xs space-y-1">
        <li>Environment info / diagnostics</li>
        <li>Feature flags</li>
        <li>Security policies</li>
      </ul>
      <p className="text-xs text-gray-500 mt-2">(Stub UI – connect to real config endpoints later.)</p>
    </div>
  );
}
