# PrefillUI.tsx Documentation

## Overview

`PrefillUI.tsx` is a sophisticated React component that provides a comprehensive interface for configuring form prefill mappings. It allows users to map form fields to data sources from predecessor nodes or global data, creating a visual and intuitive way to set up automatic form population with intelligent source discovery and mapping management.

## Key Responsibilities

- **Form Field Mapping**: Maps target form fields to available data sources
- **Data Source Discovery**: Identifies available data from predecessor nodes and global data
- **Mapping Management**: Creates, updates, and removes field mappings
- **User Interface**: Provides intuitive modal dialogs for configuration
- **State Persistence**: Maintains mapping state throughout the session
- **Auto-Prefill**: Automatic field population based on upstream data
- **Source Display**: Shows accurate source information for mapped fields

## Core Features

### Advanced Mapping System
The component implements a sophisticated mapping system that allows:
- **Field-to-Source Mapping**: Links form fields to data sources
- **Multiple Source Types**: Supports both form fields and global data
- **Hierarchical Organization**: Groups sources by node or global data
- **Visual Feedback**: Shows mapped vs unmapped fields clearly
- **Source Information**: Displays accurate source node names

### Intelligent Data Source Discovery
Automatically discovers available data sources:
- **Predecessor Analysis**: Finds all upstream nodes using breadth-first search
- **Field Extraction**: Extracts available fields from predecessor forms
- **Global Data**: Includes system-wide data sources
- **Dynamic Updates**: Refreshes when graph structure changes
- **Empty Field Handling**: Properly handles empty fields in source nodes

### Auto-Prefill Functionality
- **Automatic Population**: Automatically fills fields from upstream data
- **Toggle Control**: User can enable/disable auto-prefill per node
- **Mapping Creation**: Creates automatic mappings when data is found
- **Value Synchronization**: Keeps field values in sync with source data

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
    formFields?: Record<string, any>;
  };
}
```

#### ProcessedNode
```typescript
interface ProcessedNode extends RawNode {
  form: RawForm | undefined;
}
```

#### PrefillMapping
```typescript
interface PrefillMapping {
  sourceType: 'NODE_FIELD' | 'GLOBAL_DATA';
  sourceNodeId?: string;
  sourceFieldKey?: string;
  globalDataKey?: string;
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
  onUpdateNodeField: (nodeId: string, fieldKey: string, value: any) => void;  // Field update callback
  globalData: Record<string, any>;          // Global data for prefill mapping
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

### findPredecessorNodeIds
```typescript
const findPredecessorNodeIds = (targetNodeId: string, data: GraphData): string[]
```
- **Purpose**: Finds all predecessor nodes for a given target node
- **Algorithm**: Uses breadth-first search to traverse the graph
- **Process**:
  1. Starts with the target node
  2. Finds all parent nodes (edges where target = current)
  3. Recursively finds parents of parents
  4. Returns unique list of all predecessors
- **Returns**: Array of predecessor node IDs

### traverseUpstreamForData
```typescript
const traverseUpstreamForData = (currentNodeId: string, fieldKey: string, graphData: GraphData, processedNodes: ProcessedNode[]): any
```
- **Purpose**: Traverses upstream chain to find data for a specific field
- **Process**:
  1. Checks immediate upstream nodes for field data
  2. Recursively checks further upstream if no data found
  3. Returns first non-empty value found
- **Returns**: Field value or null if not found

### findUpstreamSourceNode
```typescript
const findUpstreamSourceNode = (currentNodeId: string, fieldKey: string, graphData: GraphData, processedNodes: ProcessedNode[]): string | null
```
- **Purpose**: Finds the node ID that contains data for a specific field
- **Process**: Similar to traverseUpstreamForData but returns node ID instead of value
- **Returns**: Source node ID or null if not found

### findActualSourceNodeName
```typescript
const findActualSourceNodeName = (currentNodeId: string, fieldKey: string, graphData: GraphData, processedNodes: ProcessedNode[]): string | null
```
- **Purpose**: Gets the name of the node that actually contains data for a field
- **Process**: Uses findUpstreamSourceNode and returns the node's name
- **Returns**: Source node name or null

### findMappedSourceNodeName
```typescript
const findMappedSourceNodeName = (mapping: PrefillMapping, processedNodes: ProcessedNode[]): string | null
```
- **Purpose**: Gets the name of the node that a field is explicitly mapped to
- **Process**: Finds the mapped source node regardless of whether it has data
- **Returns**: Mapped source node name or null

## User Interface Components

### Main Modal
- **Header**: Shows selected node name and linked form
- **Field List**: Displays all form fields with mapping status and values
- **Auto-Prefill Toggle**: Allows enabling/disabling automatic field population
- **Close Button**: Allows user to close the dialog

### Field Mapping Interface
- **Field Containers**: Visual representation of each form field
- **Mapping Status**: Clear indication of mapped vs unmapped fields
- **Field Values**: Shows current field values (read-only)
- **Map Prefill Button**: Unmapped fields show button to start mapping
- **Clear Mapping Button**: Mapped fields show button to remove mapping
- **Source Information**: Shows where mapped fields get their data from

### Source Selection Modal
- **Grouped Sources**: Hierarchical list of available data sources
- **Expandable Groups**: Groups sources by node or global data
- **Field Details**: Shows field names, values, and types
- **Empty Field Handling**: Properly displays empty fields as "(empty)"
- **Action Buttons**: Cancel and selection functionality

## State Management

### Internal State
- **prefillMappings**: Stores all field mappings for all nodes
- **fieldToMap**: Currently selected field for mapping
- **expandedGroups**: Controls which source groups are expanded
- **autoPrefillEnabled**: Tracks auto-prefill state per node

### State Updates
- **Mapping Creation**: Adds new field mappings
- **Mapping Removal**: Removes existing mappings and clears field values
- **Auto-Prefill**: Manages automatic field population
- **UI State**: Manages modal visibility and selections

## Event Handlers

### handleMapField
```typescript
const handleMapField = (fieldId: string) => void
```
- **Purpose**: Initiates the mapping process for a field
- **Process**:
  1. Sets the field to be mapped
  2. Opens the source selection modal

### handleSaveMapping
```typescript
const handleSaveMapping = (targetFieldId: string, sourceType: 'NODE_FIELD' | 'GLOBAL_DATA', sourceNodeId?: string, sourceFieldKey?: string, globalDataKey?: string) => void
```
- **Purpose**: Saves a new field mapping
- **Process**:
  1. Updates the prefillMappings state
  2. Closes the source selection modal
  3. Triggers field value update

### handleClearMapping
```typescript
const handleClearMapping = (targetFieldId: string) => void
```
- **Purpose**: Removes an existing field mapping
- **Process**:
  1. Removes the mapping from state
  2. Disables auto-prefill for the node
  3. Clears the field value
  4. Updates the UI

### getActualSourceInfo
```typescript
const getActualSourceInfo = (targetFieldKey: string, mapping: PrefillMapping) => string
```
- **Purpose**: Determines the display text for source information
- **Process**:
  1. For global data: returns "Global.fieldName"
  2. For node fields: tries mapped source name first, then actual source name
  3. Fallback: returns "Upstream.fieldName"
- **Returns**: Human-readable source information

## Data Flow

### Source Discovery Process
1. **Node Selection**: User selects a node in the graph
2. **Predecessor Analysis**: Component finds all predecessor nodes
3. **Form Extraction**: Extracts form schemas from predecessor nodes
4. **Field Enumeration**: Lists all available fields from each form
5. **Global Data**: Adds system-wide data sources
6. **Source Formatting**: Formats sources for display

### Mapping Process
1. **Field Selection**: User clicks on an unmapped field
2. **Source Display**: Component shows available sources
3. **Source Selection**: User selects a data source
4. **Mapping Creation**: Component creates the mapping
5. **Value Update**: Field value is updated immediately
6. **State Update**: Updates internal state and UI

### Auto-Prefill Process
1. **Toggle Activation**: User enables auto-prefill
2. **Field Scanning**: Component scans all unmapped fields
3. **Upstream Search**: Searches upstream for matching field names
4. **Mapping Creation**: Creates automatic mappings when data found
5. **Value Population**: Populates fields with found data

## Styling and CSS

### CSS Classes
- **main-modal-overlay**: Main dialog backdrop
- **main-modal-container**: Main dialog container
- **main-modal-header**: Dialog header section
- **main-modal-title**: Node name display
- **main-modal-subtitle**: Form name display
- **main-modal-close**: Close button
- **form-fields-container**: Container for form fields
- **field-container**: Individual field display
- **field-header**: Field header with label and actions
- **field-input**: Input field styling
- **mapping-info**: Source information display
- **auto-prefill-toggle**: Toggle switch styling

### Visual Design
- **Status Indicators**: Clear visual distinction between mapped and unmapped fields
- **Interactive Elements**: Hover states and click feedback
- **Modal Layering**: Proper z-index management for nested modals
- **Responsive Layout**: Adapts to different screen sizes

## Performance Considerations

### Memoization
- **processedNodes**: Memoized to avoid reprocessing on every render
- **availableSources**: Memoized to avoid recalculating on every render
- **Dependency Arrays**: Properly configured to trigger updates only when necessary

### State Management
- **Efficient Updates**: Uses functional state updates to avoid stale closures
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
- **Empty Field Handling**: Properly displays and handles empty fields

## Integration Points

### GraphRenderer Integration
- **Node Selection**: Receives selected node from GraphRenderer
- **Data Sharing**: Uses shared graph data structure
- **Event Coordination**: Coordinates with graph selection events

### App Component Integration
- **State Management**: Receives state from parent App component
- **Callback Functions**: Provides callbacks for state updates
- **Data Flow**: Participates in the overall application data flow
- **Global Data**: Receives global data for prefill mapping

## Usage Examples

### Basic Usage
```typescript
<NodeInfo
  graphData={graphData}
  selectedNodeId={selectedNodeId}
  isOpen={isNodeInfoOpen}
  onClose={() => setIsNodeInfoOpen(false)}
  onUpdateNodeField={handleUpdateNodeField}
  globalData={globalData}
/>
```

## Current Features

- Comprehensive form field mapping system
- Intelligent source discovery and management
- Auto-prefill functionality with toggle control
- Accurate source information display
- Global data integration
- Real-time field value updates
- Clean modal interface with expandable source groups