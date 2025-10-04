import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { fetchGraphData } from '../GraphRenderer';

// Mock the CSS imports
jest.mock('../css/App.css', () => ({}));

// Mock GraphRenderer
jest.mock('../GraphRenderer', () => ({
  __esModule: true,
  default: ({ graphData, onSelectNode, onUpdateNodeField }: any) => (
    <div data-testid="graph-renderer">
      <div data-testid="graph-data-present">{graphData ? 'true' : 'false'}</div>
      <button 
        data-testid="select-node-button"
        onClick={() => onSelectNode && onSelectNode('test-node-id')}
      >
        Select Node
      </button>
    </div>
  ),
  fetchGraphData: jest.fn()
}));

// Mock PrefillUI
jest.mock('../PrefillUI', () => ({
  __esModule: true,
  default: ({ graphData, selectedNodeId, isOpen, onClose, onUpdateNodeField, globalData }: any) => (
    <div data-testid="prefill-ui">
      <div data-testid="node-info-open">{isOpen ? 'true' : 'false'}</div>
      <div data-testid="selected-node-id">{selectedNodeId || 'none'}</div>
      <div data-testid="global-data-present">{globalData ? 'true' : 'false'}</div>
      <button 
        data-testid="close-node-info"
        onClick={() => onClose && onClose()}
      >
        Close
      </button>
      <button 
        data-testid="update-field-button"
        onClick={() => onUpdateNodeField && onUpdateNodeField('test-node-id', 'test-field', 'test-value')}
      >
        Update Field
      </button>
    </div>
  )
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders app container', () => {
      render(<App />);
      expect(screen.getByTestId('graph-renderer')).toBeInTheDocument();
      expect(screen.getByTestId('prefill-ui')).toBeInTheDocument();
    });

    test('renders with initial state', () => {
      render(<App />);
      
      // GraphRenderer should be present
      expect(screen.getByTestId('graph-renderer')).toBeInTheDocument();
      
      // PrefillUI should be present but closed
      expect(screen.getByTestId('prefill-ui')).toBeInTheDocument();
      expect(screen.getByTestId('node-info-open')).toHaveTextContent('false');
      expect(screen.getByTestId('selected-node-id')).toHaveTextContent('none');
    });
  });

  describe('Data Fetching', () => {
    test('fetches graph data on mount', async () => {
      const mockGraphData = {
        nodes: [{ id: 'test-node', data: { name: 'Test Node' } }],
        forms: [],
        edges: []
      };
      
      (fetchGraphData as jest.Mock).mockResolvedValueOnce(mockGraphData);
      
      render(<App />);
      
      await waitFor(() => {
        expect(fetchGraphData).toHaveBeenCalledTimes(1);
      });
    });

    test('handles fetch error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (fetchGraphData as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });

    test('updates graph data after successful fetch', async () => {
      const mockGraphData = {
        nodes: [{ id: 'test-node', data: { name: 'Test Node' } }],
        forms: [],
        edges: []
      };
      
      (fetchGraphData as jest.Mock).mockResolvedValueOnce(mockGraphData);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('graph-data-present')).toHaveTextContent('true');
      });
    });
  });

  describe('Node Selection', () => {
    test('opens node info when node is selected', async () => {
      const mockGraphData = {
        nodes: [{ id: 'test-node', data: { name: 'Test Node' } }],
        forms: [],
        edges: []
      };
      
      (fetchGraphData as jest.Mock).mockResolvedValueOnce(mockGraphData);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('graph-data-present')).toHaveTextContent('true');
      });
      
      const selectButton = screen.getByTestId('select-node-button');
      fireEvent.click(selectButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('node-info-open')).toHaveTextContent('true');
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('selected-node-id')).toHaveTextContent('test-node-id');
      });
    });

    test('closes node info when close is called', async () => {
      const mockGraphData = {
        nodes: [{ id: 'test-node', data: { name: 'Test Node' } }],
        forms: [],
        edges: []
      };
      
      (fetchGraphData as jest.Mock).mockResolvedValueOnce(mockGraphData);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('graph-data-present')).toHaveTextContent('true');
      });
      
      // First select a node to open the info
      const selectButton = screen.getByTestId('select-node-button');
      fireEvent.click(selectButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('node-info-open')).toHaveTextContent('true');
      });
      
      // Then close it
      const closeButton = screen.getByTestId('close-node-info');
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('node-info-open')).toHaveTextContent('false');
      });
    });
  });

  describe('Field Updates', () => {
    test('updates node field when update is called', async () => {
      const mockGraphData = {
        nodes: [{ 
          id: 'test-node-id', 
          data: { 
            name: 'Test Node',
            formFields: { testField: 'old-value' }
          } 
        }],
        forms: [],
        edges: []
      };
      
      (fetchGraphData as jest.Mock).mockResolvedValueOnce(mockGraphData);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('graph-data-present')).toHaveTextContent('true');
      });
      
      // Select node first
      const selectButton = screen.getByTestId('select-node-button');
      fireEvent.click(selectButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('node-info-open')).toHaveTextContent('true');
      });
      
      // Update field
      const updateButton = screen.getByTestId('update-field-button');
      fireEvent.click(updateButton);
      
      // The update should not cause any errors
      expect(screen.getByTestId('prefill-ui')).toBeInTheDocument();
    });
  });

  describe('Global Data', () => {
    test('provides global data to PrefillUI', () => {
      render(<App />);
      
      expect(screen.getByTestId('global-data-present')).toHaveTextContent('true');
    });

  });

  describe('ResizeObserver Error Handling', () => {
    test('sets up ResizeObserver error suppression', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<App />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Component Integration', () => {
    test('passes correct props to GraphRenderer', async () => {
      const mockGraphData = {
        nodes: [{ id: 'test-node', data: { name: 'Test Node' } }],
        forms: [],
        edges: []
      };
      
      (fetchGraphData as jest.Mock).mockResolvedValueOnce(mockGraphData);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('graph-data-present')).toHaveTextContent('true');
      });
      
      // GraphRenderer should receive the data
      expect(screen.getByTestId('graph-renderer')).toBeInTheDocument();
    });

    test('passes correct props to PrefillUI', async () => {
      const mockGraphData = {
        nodes: [{ id: 'test-node', data: { name: 'Test Node' } }],
        forms: [],
        edges: []
      };
      
      (fetchGraphData as jest.Mock).mockResolvedValueOnce(mockGraphData);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('graph-data-present')).toHaveTextContent('true');
      });
      
      // PrefillUI should receive global data
      expect(screen.getByTestId('global-data-present')).toHaveTextContent('true');
    });
  });

  describe('State Management', () => {
    test('maintains state consistency across interactions', async () => {
      const mockGraphData = {
        nodes: [{ id: 'test-node', data: { name: 'Test Node' } }],
        forms: [],
        edges: []
      };
      
      (fetchGraphData as jest.Mock).mockResolvedValueOnce(mockGraphData);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('graph-data-present')).toHaveTextContent('true');
      });
      
      // Select node
      const selectButton = screen.getByTestId('select-node-button');
      fireEvent.click(selectButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('node-info-open')).toHaveTextContent('true');
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('selected-node-id')).toHaveTextContent('test-node-id');
      });
      
      // Close node info
      const closeButton = screen.getByTestId('close-node-info');
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('node-info-open')).toHaveTextContent('false');
      });
      
      // State should be consistent
      expect(screen.getByTestId('graph-data-present')).toHaveTextContent('true');
    });
  });
});
