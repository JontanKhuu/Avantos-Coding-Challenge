import {useEffect, useState} from "react"
import {ReactFlow, Node, Edge,} from '@xyflow/react'; 
import '@xyflow/react/dist/style.css'
import "./css/Graphrenderer.css"

// API endpoint for graph data
const API_URL = "http://localhost:3000/api/v1/123/actions/blueprints/bp_456/bpv_123/graph";

// Fetch graph data from API
export const fetchGraphData = async (): Promise<any> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};

// Transform raw graph data into React Flow format
const processGraphData = (data: any): { nodes: Node[], edges: Edge[] } => {
	const edgesRaw: Array<{ source: string; target: string }> = data.edges || []

	const nodes: Node[] = (data.nodes || []).map((node: any) => ({
		id: node.id,
		data: { 
			label: node?.data?.name,
			formFields: node?.data?.formFields || {}, // Preserve form fields
			componentId: node?.data?.component_id
		},
		position: node.position
	}))

	const edges: Edge[] = edgesRaw.map((edge: any, index: number) => ({
		id: `e-${edge.source}-${edge.target}-${index}`,
		source: edge.source,
		target: edge.target,
	}))
	
	return { nodes, edges };
};

interface GraphRenderProps {
    graphData?: any;
    onSelectNode?: (nodeId: string) => void;
    onUpdateNodeField?: (nodeId: string, fieldKey: string, value: any) => void;
}

const GraphRender = ({ graphData, onSelectNode, onUpdateNodeField }: GraphRenderProps) => {
    // React Flow state
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])

    // Suppress ResizeObserver errors
    useEffect(() => {
        const handleResizeObserverError = (e: ErrorEvent) => {
            if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
                e.stopImmediatePropagation();
                e.preventDefault();
                return false;
            }
        };

        const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
            if (e.reason && e.reason.message === 'ResizeObserver loop completed with undelivered notifications.') {
                e.preventDefault();
                return false;
            }
        };

        // Listen for ResizeObserver errors
        window.addEventListener('error', handleResizeObserverError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        
        // Suppress console errors
        const originalConsoleError = console.error;
        console.error = (...args) => {
            if (args[0] && typeof args[0] === 'string' && 
                args[0].includes('ResizeObserver loop completed with undelivered notifications')) {
                return; // Suppress this specific error
            }
            originalConsoleError.apply(console, args);
        };

        return () => {
            window.removeEventListener('error', handleResizeObserverError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            console.error = originalConsoleError;
        };
    }, []);

    // Handle node clicks
    const handleNodeClick = (event: React.MouseEvent, node: Node) => {
        if (onSelectNode) {
            onSelectNode(node.id);
        }
    };

    // Process graph data with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (graphData) {
                const { nodes, edges } = processGraphData(graphData)
                setNodes(nodes)
                setEdges(edges)
                return
            }

            // Fetch data if not provided
            (async () => {  
                try {
                    const data = await fetchGraphData()
                    const { nodes, edges } = processGraphData(data);
                    setNodes(nodes)
                    setEdges(edges)
                } catch (error) {
                    console.error("Error fetching DAG: ", error); 
                }
            })()
        }, 100); // 100ms debounce

        return () => clearTimeout(timeoutId);
    }, [graphData])

    return (
        <>
            <h1>DAG Visualization</h1>
            <div className="graph-container">
                <ReactFlow 
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={handleNodeClick}
                    fitView 
                    fitViewOptions={{ padding: 0.1 }}
                    minZoom={0.1}
                    maxZoom={2}
                    deleteKeyCode={null}
                    multiSelectionKeyCode={null}
                    selectionKeyCode={null}
                    preventScrolling={false}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={true}
                />
            </div>
        </>
    )
}

export default GraphRender;