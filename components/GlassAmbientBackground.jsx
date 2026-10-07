'use client';

export default function GlassAmbientBackground() {
  return (
    <div className="glass-ambient-wrapper" aria-hidden="true">
      <div className="ambient-orb orb-primary" />
      <div className="ambient-orb orb-cyan" />
      <div className="ambient-orb orb-purple" />
      <div className="ambient-orb orb-amber" />
      <div className="ambient-glass-grid" />
    </div>
  );
}
