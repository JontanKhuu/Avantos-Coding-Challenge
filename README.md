# Avantos Coding Challenge - DAG Visualization & Prefill System

A sophisticated React application that visualizes Directed Acyclic Graphs (DAGs) using React Flow and provides an intelligent form prefill system. The application allows users to map form fields to data sources from upstream nodes or global data, with automatic field population using breadth-first search algorithms.

## Features

- **Interactive DAG Visualization**: Built with React Flow to display nodes and edges
- **Intelligent Prefill System**: Map form fields to upstream data sources or global data
- **Auto-Prefill Functionality**: Automatic field population with BFS-based source discovery
- **Source Management**: Visual interface for creating, updating, and removing field mappings
- **Global Data Integration**: Support for system-wide data sources
- **Real-time Updates**: Dynamic field value synchronization
- **Comprehensive Error Handling**: ResizeObserver error suppression and graceful fallbacks

## Architecture

The application consists of three main components:

1. **App.tsx** - Main application component managing global state and data flow
2. **GraphRenderer.tsx** - Handles DAG visualization, data processing, and API integration
3. **PrefillUI.tsx** - Sophisticated prefill system with mapping management and auto-prefill

## Technology Stack

- **React 19.2.0** - Frontend framework with hooks
- **TypeScript 4.9.5** - Type safety and development experience
- **@xyflow/react 12.8.6** - Graph visualization library
- **React Scripts 5.0.1** - Build tooling
- **Jest & React Testing Library** - Testing framework

## How to Run Locally

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd avantos_coding_challenge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server** (if using the included mock server)
   ```bash
   cd frontendserver
   npm install
   npm start
   ```
   This starts the mock API server on `http://localhost:3000`

4. **Start the React development server**
   ```bash
   npm start
   ```

5. **Open the application**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The application will load the DAG visualization
   - Click on any node to open the prefill interface

### Alternative: Using External API

If you have your own backend API, update the API URL in `src/GraphRenderer.tsx`:

```typescript
const API_URL = "http://your-api-server/api/v1/123/actions/blueprints/bp_456/bpv_123/graph";
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## How to Extend with New Data Sources

### 1. Adding New Global Data Sources

Edit `src/App.tsx` to add new global data:

```typescript
const [globalData] = useState<Record<string, any>>({
  userId: 'user123',
  timestamp: new Date().toISOString(),
  // Add your new global data sources here
  customField: 'customValue',
  apiKey: 'your-api-key',
  environment: 'production'
});
```

### 2. Extending Form Field Schemas

Update the form schema in your backend API or mock data (`frontendserver/graph.json`):

```json
{
  "forms": [
    {
      "id": "form-id",
      "name": "Your Form",
      "field_schema": {
        "properties": {
          "existingField": { "type": "string" },
          "newField": { "type": "string" },
          "customField": { "type": "number" }
        }
      }
    }
  ]
}
```

### 3. Adding Custom Field Types

Extend the `PrefillUI.tsx` component to handle new field types:

```typescript
// In the renderFormFields function, add custom rendering logic
const renderCustomField = (fieldKey: string, fieldSchema: any) => {
  if (fieldSchema.type === 'number') {
    return (
      <input
        type="number"
        value={fieldValue}
        readOnly
        className={`field-input ${isMapped ? 'mapped' : ''}`}
        placeholder={`Enter ${fieldKey}...`}
      />
    );
  }
  // Add more custom field types as needed
};
```

### 4. Custom Data Processing

Extend the `processGraphData` function in `GraphRenderer.tsx`:

```typescript
const processGraphData = (data: any): { nodes: Node[], edges: Edge[] } => {
  // Existing processing logic...
  
  // Add custom data processing
  const nodes: Node[] = (data.nodes || []).map((node: any) => ({
    id: node.id,
    data: { 
      label: node?.data?.name,
      formFields: node?.data?.formFields || {},
      componentId: node?.data?.component_id,
      // Add custom data fields
      customData: node?.data?.customField || null
    },
    position: node.position
  }));
  
  return { nodes, edges };
};
```

## Important Patterns to Pay Attention To

### 1. **Breadth-First Search (BFS) Pattern**

The prefill system uses BFS for upstream data traversal. This ensures the closest available data source is always found first:

```typescript
// Pattern: BFS traversal for data discovery
const traverseUpstreamForData = (currentNodeId: string, fieldKey: string, graphData: GraphData, processedNodes: ProcessedNode[]): any => {
  const queue: string[] = [currentNodeId];
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    // Check all direct upstream nodes first (BFS)
    // Then add their upstream nodes to queue
  }
};
```

**Why this matters**: BFS ensures that when multiple upstream sources have data, the closest one is prioritized, providing better user experience and more logical data flow.

### 2. **State Management Pattern**

The application uses a centralized state management pattern with callback props:

```typescript
// Pattern: Centralized state with callback props
const handleUpdateNodeField = (nodeId: string, fieldKey: string, value: any) => {
  setGraphData((prevData: any) => {
    // Immutable state updates
    return {
      ...prevData,
      nodes: prevData.nodes.map((node: any) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              formFields: {
                ...(node.data.formFields || {}),
                [fieldKey]: value
              }
            }
          };
        }
        return node;
      })
    };
  });
};
```

**Why this matters**: This pattern ensures data consistency across components and makes the application predictable and debuggable.

### 3. **Error Handling Pattern**

Comprehensive error handling with ResizeObserver suppression:

```typescript
// Pattern: Comprehensive error handling
useEffect(() => {
  const handleResizeObserverError = (e: ErrorEvent) => {
    if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
      e.stopImmediatePropagation();
      e.preventDefault();
      return false;
    }
  };
  
  window.addEventListener('error', handleResizeObserverError);
  // Cleanup in return function
}, []);
```

**Why this matters**: React Flow can trigger ResizeObserver errors that break the application. This pattern prevents crashes and provides a stable user experience.

### 4. **Memoization Pattern**

Strategic use of `useMemo` for performance optimization:

```typescript
// Pattern: Memoized expensive calculations
const processedNodes: ProcessedNode[] = useMemo(() => {
  if (!graphData) return [];
  return processGraphData(graphData);
}, [graphData]);

const availableSources = useMemo(() => {
  // Expensive source calculation
}, [graphData, selectedNodeId, processedNodes, globalData]);
```

**Why this matters**: Graph processing and source discovery are expensive operations. Memoization prevents unnecessary recalculations and improves performance.

### 5. **Debouncing Pattern**

Debounced updates to prevent performance issues:

```typescript
// Pattern: Debounced updates
useEffect(() => {
  const timeoutId = setTimeout(() => {
    // Process data
  }, 100); // 100ms debounce
  
  return () => clearTimeout(timeoutId);
}, [graphData]);
```

**Why this matters**: Rapid data updates can cause performance issues and ResizeObserver errors. Debouncing ensures smooth operation.

### 6. **Interface Segregation Pattern**

Well-defined TypeScript interfaces for type safety:

```typescript
// Pattern: Clear interface definitions
interface PrefillMapping {
  sourceType: 'NODE_FIELD' | 'GLOBAL_DATA';
  sourceNodeId?: string;
  sourceFieldKey?: string;
  globalDataKey?: string;
}

interface GraphData {
  nodes: RawNode[];
  forms: RawForm[];
  edges: Array<{ source: string; target: string }>;
}
```

**Why this matters**: Clear interfaces make the code self-documenting, prevent bugs, and make extensions easier.

## Project Structure

```
src/
├── App.tsx                 # Main application component with global state
├── GraphRenderer.tsx       # DAG visualization and data processing
├── PrefillUI.tsx          # Prefill system with mapping management
├── css/                   # Stylesheets
│   ├── App.css
│   ├── Graphrenderer.css
│   ├── PrefillUI.css
│   └── index.css
├── tests/                 # Test files
│   ├── App.test.tsx
│   ├── GraphRenderer.test.tsx
│   ├── PrefillUI.test.tsx
│   └── __mocks__/
└── index.tsx              # Application entry point

frontendserver/
├── graph.json             # Mock graph data
├── index.js              # Mock API server
└── package.json          # Server dependencies

docs/
├── App.md                # App component documentation
├── GraphRenderer.md      # GraphRenderer documentation
└── PrefillUI.md         # PrefillUI documentation
```

## API Integration

The application integrates with a REST API to:
- Fetch DAG structure (nodes, edges, forms)
- Provide form field schemas
- Support real-time data updates

### Required API Endpoint

- `GET /api/v1/123/actions/blueprints/bp_456/bpv_123/graph` - Fetch complete graph data

### Expected Data Format

```json
{
  "nodes": [
    {
      "id": "node-id",
      "data": {
        "name": "Node Name",
        "component_id": "form-id",
        "formFields": {
          "field1": "value1",
          "field2": "value2"
        }
      },
      "position": { "x": 100, "y": 100 }
    }
  ],
  "forms": [
    {
      "id": "form-id",
      "name": "Form Name",
      "field_schema": {
        "properties": {
          "field1": { "type": "string" },
          "field2": { "type": "string" }
        }
      }
    }
  ],
  "edges": [
    { "source": "node1", "target": "node2" }
  ]
}
```

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Code Style

The project follows these best practices:
- Functional components with hooks
- TypeScript interfaces for all data structures
- Modular component architecture
- Comprehensive error handling
- Strategic memoization for performance
- Immutable state updates
- BFS algorithms for data traversal

## Testing

The application includes comprehensive tests covering:
- Component rendering and interaction
- Data processing and API integration
- Prefill functionality and mapping
- Error handling and edge cases
- BFS algorithm behavior

Run tests with:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is part of the Avantos coding challenge.