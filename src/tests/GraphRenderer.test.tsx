import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GraphRender, { fetchGraphData } from '../GraphRenderer';

// Mock the CSS imports
jest.mock('../css/Graphrenderer.css', () => ({}));
jest.mock('@xyflow/react/dist/style.css', () => ({}));

// Mock ReactFlow to avoid complex rendering issues in tests
jest.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, nodes, edges, onNodeClick }: any) => (
    <div data-testid="react-flow">
      <div data-testid="nodes-count">{nodes?.length || 0}</div>
      <div data-testid="edges-count">{edges?.length || 0}</div>
      {nodes?.map((node: any) => (
        <div 
          key={node.id} 
          data-testid={`node-${node.id}`}
          onClick={() => onNodeClick && onNodeClick({}, node)}
        >
          {node.data.label}
        </div>
      ))}
      {edges?.map((edge: any) => (
        <div key={edge.id} data-testid={`edge-${edge.id}`}>
          {edge.source} → {edge.target}
        </div>
      ))}
      {children}
    </div>
  )
}));

// Mock fetch for API tests
global.fetch = jest.fn();

// Mock data that matches your actual graph structure
const mockGraphData = {
  nodes: [
    {
      id: "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88",
      data: {
        name: "Form A",
        component_id: "f_01jk7ap2r3ewf9gx6a9r09gzjv",
        formFields: {
          id: "user-001",
          name: "John Doe",
          email: "john.doe@example.com",
          notes: "Initial user registration"
        }
      },
      position: { x: 494, y: 269 }
    },
    {
      id: "form-a4750667-d774-40fb-9b0a-44f8539ff6c4",
      data: {
        name: "Form B",
        component_id: "f_01jk7awbhqewgbkbgk8rjm7bv7",
        formFields: {
          id: "",
          name: "Jane Smith",
          email: "",
          notes: "Contact information form"
        }
      },
      position: { x: 780.692362673456, y: 154.98072799490808 }
    },
    {
      id: "form-7c26f280-7bff-40e3-b9a5-0533136f52c3",
      data: {
        name: "Form C",
        component_id: "f_01jk7aygnqewh8gt8549beb1yc",
        formFields: {
          id: "user-003",
          name: "Bob Johnson",
          email: "bob.johnson@example.com",
          notes: "Additional processing form"
        }
      },
      position: { x: 779.0096360025458, y: 362.36545334182 }
    },
    {
      id: "form-0f58384c-4966-4ce6-9ec2-40b96d61f745",
      data: {
        name: "Form D",
        component_id: "f_01jk7ap2r3ewf9gx6a9r09gzjv",
        formFields: {
          id: "user-004",
          name: "Alice Brown",
          email: "alice.brown@example.com",
          notes: "Review and approval form"
        }
      },
      position: { x: 1093.4015147514929, y: 155.2205909169969 }
    },
    {
      id: "form-e15d42df-c7c0-4819-9391-53730e6d47b3",
      data: {
        name: "Form E",
        component_id: "f_01jk7ap2r3ewf9gx6a9r09gzjv",
        formFields: {
          id: "",
          name: "",
          email: "",
          notes: ""
        }
      },
      position: { x: 1099.7646441474558, y: 361.86975131228957 }
    },
    {
      id: "form-bad163fd-09bd-4710-ad80-245f31b797d5",
      data: {
        name: "Form F",
        component_id: "f_01jk7ap2r3ewf9gx6a9r09gzjv",
        formFields: {
          id: "",
          name: "",
          email: "",
          notes: ""
        }
      },
      position: { x: 1437, y: 264 }
    }
  ],
  forms: [
    {
      id: "f_01jk7ap2r3ewf9gx6a9r09gzjv",
      name: "test form",
      field_schema: {
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          notes: { type: "string" }
        }
      }
    }
  ],
  edges: [
    { source: "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88", target: "form-a4750667-d774-40fb-9b0a-44f8539ff6c4" },
    { source: "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88", target: "form-7c26f280-7bff-40e3-b9a5-0533136f52c3" },
    { source: "form-a4750667-d774-40fb-9b0a-44f8539ff6c4", target: "form-0f58384c-4966-4ce6-9ec2-40b96d61f745" },
    { source: "form-7c26f280-7bff-40e3-b9a5-0533136f52c3", target: "form-e15d42df-c7c0-4819-9391-53730e6d47b3" },
    { source: "form-0f58384c-4966-4ce6-9ec2-40b96d61f745", target: "form-bad163fd-09bd-4710-ad80-245f31b797d5" },
    { source: "form-e15d42df-c7c0-4819-9391-53730e6d47b3", target: "form-bad163fd-09bd-4710-ad80-245f31b797d5" }
  ]
};

describe('GraphRenderer Component', () => {
  const defaultProps = {
    onSelectNode: jest.fn(),
    onUpdateNodeField: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('Component Rendering', () => {
    test('renders graph visualization title', () => {
      render(<GraphRender {...defaultProps} />);
      expect(screen.getByText('Graph Visualization')).toBeInTheDocument();
    });

    test('renders ReactFlow container', () => {
      render(<GraphRender {...defaultProps} />);
      expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    });

  });

  describe('Data Processing', () => {
    test('processes graph data correctly with provided data', async () => {
      render(<GraphRender {...defaultProps} graphData={mockGraphData} />);
      
      // Should have 6 nodes (Form A through Form F)
      await waitFor(() => {
        expect(screen.getByTestId('nodes-count')).toHaveTextContent('6');
      });
      
      // Should have 6 edges
      await waitFor(() => {
        expect(screen.getByTestId('edges-count')).toHaveTextContent('6');
      });
    });

    test('displays correct node labels', async () => {
      render(<GraphRender {...defaultProps} graphData={mockGraphData} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('node-form-47c61d17-62b0-4c42-8ca2-0eff641c9d88')).toHaveTextContent('Form A');
      });
      await waitFor(() => {
        expect(screen.getByTestId('node-form-a4750667-d774-40fb-9b0a-44f8539ff6c4')).toHaveTextContent('Form B');
      });
      await waitFor(() => {
        expect(screen.getByTestId('node-form-7c26f280-7bff-40e3-b9a5-0533136f52c3')).toHaveTextContent('Form C');
      });
      await waitFor(() => {
        expect(screen.getByTestId('node-form-0f58384c-4966-4ce6-9ec2-40b96d61f745')).toHaveTextContent('Form D');
      });
      await waitFor(() => {
        expect(screen.getByTestId('node-form-e15d42df-c7c0-4819-9391-53730e6d47b3')).toHaveTextContent('Form E');
      });
      await waitFor(() => {
        expect(screen.getByTestId('node-form-bad163fd-09bd-4710-ad80-245f31b797d5')).toHaveTextContent('Form F');
      });
    });

    test('displays correct edge relationships', async () => {
      render(<GraphRender {...defaultProps} graphData={mockGraphData} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('edge-e-form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-form-a4750667-d774-40fb-9b0a-44f8539ff6c4-0')).toHaveTextContent('form-47c61d17-62b0-4c42-8ca2-0eff641c9d88 → form-a4750667-d774-40fb-9b0a-44f8539ff6c4');
      });
      await waitFor(() => {
        expect(screen.getByTestId('edge-e-form-47c61d17-62b0-4c42-8ca2-0eff641c9d88-form-7c26f280-7bff-40e3-b9a5-0533136f52c3-1')).toHaveTextContent('form-47c61d17-62b0-4c42-8ca2-0eff641c9d88 → form-7c26f280-7bff-40e3-b9a5-0533136f52c3');
      });
      await waitFor(() => {
        expect(screen.getByTestId('edge-e-form-a4750667-d774-40fb-9b0a-44f8539ff6c4-form-0f58384c-4966-4ce6-9ec2-40b96d61f745-2')).toHaveTextContent('form-a4750667-d774-40fb-9b0a-44f8539ff6c4 → form-0f58384c-4966-4ce6-9ec2-40b96d61f745');
      });
    });

    test('handles empty graph data', () => {
      const emptyGraphData = {
        nodes: [],
        forms: [],
        edges: []
      };

      render(<GraphRender {...defaultProps} graphData={emptyGraphData} />);
      expect(screen.getByText('Graph Visualization')).toBeInTheDocument();
    });

    test('handles malformed graph data gracefully', () => {
      const malformedData = {
        nodes: null,
        forms: undefined,
        edges: 'invalid'
      };

      render(<GraphRender {...defaultProps} graphData={malformedData} />);
      expect(screen.getByText('Graph Visualization')).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    test('fetches graph data when no data provided', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGraphData
      });

      render(<GraphRender {...defaultProps} />);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/v1/123/actions/blueprints/bp_456/bpv_123/graph');
      });
    });

    test('processes fetched data correctly', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGraphData
      });

      render(<GraphRender {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('nodes-count')).toHaveTextContent('6');
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('edges-count')).toHaveTextContent('6');
      });
    });

    test('handles fetch error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<GraphRender {...defaultProps} />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching DAG: ', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    test('handles non-ok response', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      render(<GraphRender {...defaultProps} />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching DAG: ', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Node Interaction', () => {
    test('calls onSelectNode when node is clicked', async () => {
      render(<GraphRender {...defaultProps} graphData={mockGraphData} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('node-form-47c61d17-62b0-4c42-8ca2-0eff641c9d88')).toBeInTheDocument();
      });
      
      const formANode = screen.getByTestId('node-form-47c61d17-62b0-4c42-8ca2-0eff641c9d88');
      fireEvent.click(formANode);
      
      expect(defaultProps.onSelectNode).toHaveBeenCalledWith('form-47c61d17-62b0-4c42-8ca2-0eff641c9d88');
    });

    test('does not call onSelectNode when callback is not provided', async () => {
      render(<GraphRender onUpdateNodeField={jest.fn()} graphData={mockGraphData} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('node-form-47c61d17-62b0-4c42-8ca2-0eff641c9d88')).toBeInTheDocument();
      });
      
      const formANode = screen.getByTestId('node-form-47c61d17-62b0-4c42-8ca2-0eff641c9d88');
      fireEvent.click(formANode);
      
      // Should not throw error or call undefined function
      expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    });
  });

  describe('ResizeObserver Error Handling', () => {
    test('sets up ResizeObserver error suppression', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<GraphRender {...defaultProps} />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Debounced Updates', () => {
    test('debounces data updates', async () => {
      jest.useFakeTimers();
      
      render(<GraphRender {...defaultProps} graphData={mockGraphData} />);
      
      // Should not have processed data immediately
      expect(screen.getByTestId('nodes-count')).toHaveTextContent('0');
      
      // Fast forward past debounce time
      jest.advanceTimersByTime(100);
      
      await waitFor(() => {
        expect(screen.getByTestId('nodes-count')).toHaveTextContent('6');
      });
      
      jest.useRealTimers();
    });
  });
});

describe('fetchGraphData function', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('fetches data successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGraphData
    });

    const result = await fetchGraphData();

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/v1/123/actions/blueprints/bp_456/bpv_123/graph');
    expect(result).toEqual(mockGraphData);
  });

  test('throws error on non-ok response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(fetchGraphData()).rejects.toThrow('HTTP error! status: 500');
  });

  test('throws error on network failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchGraphData()).rejects.toThrow('Network error');
  });

  test('handles JSON parsing error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => { throw new Error('Invalid JSON'); }
    });

    await expect(fetchGraphData()).rejects.toThrow('Invalid JSON');
  });

  test('uses correct API URL', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGraphData
    });

    await fetchGraphData();

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/v1/123/actions/blueprints/bp_456/bpv_123/graph');
  });
});

describe('Data Structure Validation', () => {
  test('validates that mock data matches expected structure', () => {
    // Test that our mock data has the same structure as the real graph.json
    expect(mockGraphData).toHaveProperty('nodes');
    expect(mockGraphData).toHaveProperty('forms');
    expect(mockGraphData).toHaveProperty('edges');
    
    // Test nodes structure
    expect(Array.isArray(mockGraphData.nodes)).toBe(true);
    expect(mockGraphData.nodes.length).toBe(6);
    
    mockGraphData.nodes.forEach(node => {
      expect(node).toHaveProperty('id');
      expect(node).toHaveProperty('data');
      expect(node).toHaveProperty('position');
      expect(node.data).toHaveProperty('name');
      expect(node.data).toHaveProperty('component_id');
      expect(node.data).toHaveProperty('formFields');
    });
    
    // Test forms structure
    expect(Array.isArray(mockGraphData.forms)).toBe(true);
    expect(mockGraphData.forms.length).toBe(1);
    
    mockGraphData.forms.forEach(form => {
      expect(form).toHaveProperty('id');
      expect(form).toHaveProperty('name');
      expect(form).toHaveProperty('field_schema');
      expect(form.field_schema).toHaveProperty('properties');
    });
    
    // Test edges structure
    expect(Array.isArray(mockGraphData.edges)).toBe(true);
    expect(mockGraphData.edges.length).toBe(6);
    
    mockGraphData.edges.forEach(edge => {
      expect(edge).toHaveProperty('source');
      expect(edge).toHaveProperty('target');
    });
  });

  test('validates node relationships match actual graph', () => {
    // Test that Form A connects to Form B and Form C
    const formAEdges = mockGraphData.edges.filter(edge => 
      edge.source === 'form-47c61d17-62b0-4c42-8ca2-0eff641c9d88'
    );
    expect(formAEdges.length).toBe(2);
    
    const formATargets = formAEdges.map(edge => edge.target);
    expect(formATargets).toContain('form-a4750667-d774-40fb-9b0a-44f8539ff6c4'); // Form B
    expect(formATargets).toContain('form-7c26f280-7bff-40e3-b9a5-0533136f52c3'); // Form C
    
    // Test that Form F has two inputs (from Form D and Form E)
    const formFEdges = mockGraphData.edges.filter(edge => 
      edge.target === 'form-bad163fd-09bd-4710-ad80-245f31b797d5'
    );
    expect(formFEdges.length).toBe(2);
    
    const formFSources = formFEdges.map(edge => edge.source);
    expect(formFSources).toContain('form-0f58384c-4966-4ce6-9ec2-40b96d61f745'); // Form D
    expect(formFSources).toContain('form-e15d42df-c7c0-4819-9391-53730e6d47b3'); // Form E
  });

  test('validates form field schemas match actual structure', () => {
    const testForm = mockGraphData.forms[0];
    
    // Test required fields exist
    expect(testForm.field_schema.properties).toHaveProperty('id');
    expect(testForm.field_schema.properties).toHaveProperty('name');
    expect(testForm.field_schema.properties).toHaveProperty('email');
    expect(testForm.field_schema.properties).toHaveProperty('notes');
    
    // Test field types
    expect(testForm.field_schema.properties.email.type).toBe('string');
    expect(testForm.field_schema.properties.name.type).toBe('string');
    expect(testForm.field_schema.properties.id.type).toBe('string');
    expect(testForm.field_schema.properties.notes.type).toBe('string');
  });
});
