// src/__tests__/App.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  
  it('should render without crashing', () => {
    render(<App />);
    expect(true).toBe(true);
  });

  it('should render GameVault title', () => {
    render(<App />);
    const titleElement = screen.getByText(/GameVault/i);
    expect(titleElement).toBeDefined();
  });

  it('should render initialization text', () => {
    render(<App />);
    const textElement = screen.getByText(/Initialization/i);
    expect(textElement).toBeDefined();
  });

  it('should have Get Started button', () => {
    render(<App />);
    const buttonElement = screen.getByRole('button', { name: /Get Started/i });
    expect(buttonElement).toBeDefined();
  });

});