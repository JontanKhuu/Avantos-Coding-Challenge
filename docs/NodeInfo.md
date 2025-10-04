# NodeInfo.tsx Documentation (formerly PrefillUI.tsx)

## Overview

`NodeInfo.tsx` is a simplified React component that displays basic information about selected nodes in the graph. It replaced the complex PrefillUI component with a clean, functional interface that shows node details and linked form fields.

## Key Responsibilities

- **Node Information Display**: Shows basic information about selected nodes
- **Form Field Listing**: Displays available form fields for linked forms
- **Modal Interface**: Provides a clean modal dialog for information display
- **Data Processing**: Links nodes to their associated forms

## Core Features

### Information Display
The component provides:
- **Node Name**: Displays the selected node's name
- **Form Information**: Shows linked form name or "No Form Linked"
- **Field Listing**: Lists all available form fields when a form is linked
- **Clean Interface**: Simple, focused user experience

### Data Processing
- **Form Linking**: Connects nodes to their associated forms
- **Field Extraction**: Extracts form field information from schemas
- **Data Validation**: Handles cases where forms are not linked

## Data Structures

### Core Interfaces

#### RawForm
```typescript
interface RawForm {
  id: string;
  name: string;
  field_schema: { properties: Record<string, any> };
}
```

#### RawNode
```typescript
interface RawNode {
  id: string;
  data: {
    name: string;
    component_id: string;
  };
}
```

#### ProcessedNode
```typescript
interface ProcessedNode extends RawNode {
  form: RawForm | undefined;
}
```

#### GraphData
```typescript
interface GraphData {
  nodes: RawNode[];
  forms: RawForm[];
  edges: Array<{ source: string; target: string }>;
}
```

## Component Props

### NodeInfoProps
```typescript
interface NodeInfoProps {
  graphData: GraphData | undefined;           // Complete graph data
  selectedNodeId: string | undefined;       // Currently selected node
  isOpen: boolean;                           // Dialog visibility
  onClose: () => void;                       // Close dialog callback
}
```

## Key Functions

### processGraphData
```typescript
const processGraphData = (data: GraphData): ProcessedNode[]
```
- **Purpose**: Processes raw graph data and links nodes to their forms
- **Process**:
  1. Creates a map of form IDs to form objects
  2. Links each node to its corresponding form
  3. Returns processed nodes with form references
- **Returns**: Array of ProcessedNode objects

## User Interface Components

### Main Modal
- **Header**: Shows selected node name and linked form
- **Content**: Displays form fields or "No form data available" message
- **Close Button**: Allows user to close the dialog

### Field Display
- **Field List**: Shows all available form fields
- **Clean Layout**: Simple, readable field listing
- **No Interaction**: Read-only information display

## State Management

### Internal State
- **processedNodes**: Memoized processed node data
- **selectedNode**: Currently selected node information

### State Updates
- **Data Processing**: Processes data when graph data changes
- **Node Selection**: Updates when selected node changes

## Data Flow

### Information Display Process
1. **Node Selection**: User selects a node in the graph
2. **Data Processing**: Component processes graph data to link nodes and forms
3. **Form Lookup**: Finds the form associated with the selected node
4. **Field Extraction**: Extracts form field information
5. **Display**: Shows node and form information in modal

## Styling and CSS

### CSS Classes
- **main-modal-overlay**: Main dialog backdrop
- **main-modal-container**: Main dialog container
- **main-modal-header**: Dialog header section
- **main-modal-title**: Node name display
- **main-modal-subtitle**: Form name display
- **main-modal-close**: Close button
- **field-list**: Container for form fields
- **field-item**: Individual field display

### Visual Design
- **Clean Layout**: Simple, focused design
- **Modal Interface**: Proper z-index and overlay management
- **Responsive Design**: Adapts to different screen sizes
- **Consistent Styling**: Matches overall application design

## Performance Considerations

### Memoization
- **processedNodes**: Memoized to avoid reprocessing on every render
- **Dependency Arrays**: Properly configured to trigger updates only when necessary

### State Management
- **Efficient Updates**: Uses functional state updates
- **Minimal Re-renders**: Optimizes component re-rendering
- **Memory Management**: Properly cleans up state when components unmount

## Error Handling

### Data Validation
- **Null Checks**: Handles missing graph data gracefully
- **Form Validation**: Validates form schema structure
- **Edge Cases**: Handles nodes without associated forms

### User Experience
- **Fallback UI**: Provides appropriate content when data is missing
- **Clear Messaging**: Shows "No form data available" when appropriate

## Integration Points

### GraphRenderer Integration
- **Node Selection**: Receives selected node from GraphRenderer
- **Data Sharing**: Uses shared graph data structure
- **Event Coordination**: Coordinates with graph selection events

### App Component Integration
- **State Management**: Receives state from parent App component
- **Callback Functions**: Provides callbacks for state updates
- **Data Flow**: Participates in the overall application data flow

## Usage Examples

### Basic Usage
```typescript
<NodeInfo
  graphData={graphData}
  selectedNodeId={selectedNodeId}
  isOpen={isNodeInfoOpen}
  onClose={() => setIsNodeInfoOpen(false)}
/>
```

## Recent Changes

### Major Simplification
- **Replaced PrefillUI**: Completely replaced the complex PrefillUI component
- **Removed Complex Features**: Eliminated broken prefill mapping system
- **Simplified Interface**: Focused on basic information display
- **Cleaner Code**: Reduced complexity and improved maintainability

### What Was Removed
- Complex prefill mapping system
- Source field discovery and management
- Mapping rule creation and storage
- Nested modal dialogs
- Cosmetic UI elements (box icons, summary boxes)
- State management for mappings
- Event handlers for mapping operations

### What Was Added
- Simple node information display
- Clean form field listing
- Streamlined modal interface
- Focused data processing
- Improved user experience

## Future Enhancements

Potential improvements could include:
- **Form Field Details**: Show field types and validation rules
- **Node Relationships**: Display upstream/downstream connections
- **Export Functionality**: Export node information
- **Search Functionality**: Search through form fields
- **Custom Styling**: Allow customization of node appearance
