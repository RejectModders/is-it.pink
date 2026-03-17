'use client';

import { Star, Heart } from 'lucide-react';
import type { Particle } from '@/lib/game-constants';

interface ParticlesProps {
  particles: Particle[];
}

function renderParticle(p: Particle) {
  const style = {
    left: `${p.x}px`,
    top: `${p.y}px`,
    transform: `rotate(${p.rotation}deg)`,
  };

  if (p.type === 'star') {
    return (
      <Star
        key={p.id}
        className="fixed pointer-events-none"
        style={{ ...style, color: p.color, width: p.size, height: p.size }}
        fill={p.color}
      />
    );
  }
  if (p.type === 'heart') {
    return (
      <Heart
        key={p.id}
        className="fixed pointer-events-none"
        style={{ ...style, color: p.color, width: p.size, height: p.size }}
        fill={p.color}
      />
    );
  }
  return (
    <div
      key={p.id}
      className="fixed rounded-full pointer-events-none"
      style={{
        ...style,
        width: `${p.size}px`,
        height: `${p.size}px`,
        backgroundColor: p.color,
        boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
      }}
    />
  );
}

export function Particles({ particles }: ParticlesProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(renderParticle)}
    </div>
  );
}
