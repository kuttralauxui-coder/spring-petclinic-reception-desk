import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';
describe('Button', () => {
  it('forwards click and disabled state', () => {
    const click = vi.fn();
    const { rerender } = render(<Button onClick={click}>Save</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(click).toHaveBeenCalledTimes(1);
    rerender(<Button disabled onClick={click}>Save</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(click).toHaveBeenCalledTimes(1);
  });
});
