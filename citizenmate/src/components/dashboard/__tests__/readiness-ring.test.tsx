import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { ReadinessRing } from '../readiness-ring';

// We mock framer-motion to avoid animation-related warnings/errors in JSDOM tests
vi.mock('framer-motion', () => ({
  motion: {
    circle: (props: any) => <circle {...props} />,
    span: (props: any) => <span {...props} />,
  },
}));

test('renders ReadinessRing with given score', () => {
  render(<ReadinessRing score={85} />);
  expect(screen.getByText('85%')).toBeInTheDocument();
  expect(screen.getByText(/ready/i)).toBeInTheDocument();
});

test('applies correct styling based on score', () => {
  const { container, rerender } = render(<ReadinessRing score={85} />);
  // Check for the high score color class
  const circles = container.querySelectorAll('circle');
  // the inner progress ring is the last circle
  expect(circles[3]).toHaveClass('stroke-cm-eucalyptus');

  // Medium score
  rerender(<ReadinessRing score={60} />);
  expect(container.querySelectorAll('circle')[3]).toHaveClass('stroke-cm-gold');
  
  // Low score
  rerender(<ReadinessRing score={30} />);
  expect(container.querySelectorAll('circle')[3]).toHaveClass('stroke-orange-400');

  // Very low score
  rerender(<ReadinessRing score={10} />);
  expect(container.querySelectorAll('circle')[3]).toHaveClass('stroke-cm-red');
});
