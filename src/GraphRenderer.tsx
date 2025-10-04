import {useEffect, useState, useCallback} from "react"
import {ReactFlow, Node, Edge,} from '@xyflow/react'; 
import '@xyflow/react/dist/style.css'
import "./css/Graphrenderer.css"

const API_URL = "http://localhost:3000/api/v1/123/actions/blueprints/bp_456/bpv_123/graph";

export const fetchGraphData = async (): Promise<any> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};

const processGraphData = (data: any): { nodes: Node[], edges: Edge[] } => {
	const edgesRaw: Array<{ source: string; target: string }> = data.edges || []

	const nodes: Node[] = (data.nodes || []).map((node: any) => ({
		id: node.id,
		data: { 
			label: node?.data?.name,
			formFields: node?.data?.formFields || {}, // Store form field values
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
    const [nodes, addNode] = useState<Node[]>([])
    const [edges, addEdge] = useState<Edge[]>([])

    // Suppress ResizeObserver errors
    useEffect(() => {
        const handleResizeObserverError = (e: ErrorEvent) => {
            if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
                e.stopImmediatePropagation();
            }
        };

        window.addEventListener('error', handleResizeObserverError);
        return () => window.removeEventListener('error', handleResizeObserverError);
    }, []);

    const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        if (onSelectNode) {
            onSelectNode(node.id);
        }
    }, [onSelectNode]);

    useEffect(() => {
        if (graphData) {
            const { nodes, edges } = processGraphData(graphData)
            addNode(nodes)
            addEdge(edges)
            return
        }

        (async () => {  
            try {
                const data = await fetchGraphData()
                const { nodes, edges } = processGraphData(data);
                addNode(nodes)
                addEdge(edges)
            } catch (error) {
                console.error("Error fetching DAG: ", error); 
            }
        })()
    }, [graphData])

    return (
        <>
            <h1>Graph Visualization</h1>
            <div className="graph-container">
                <ReactFlow 
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={handleNodeClick}
                    fitView 
                    fitViewOptions={{ padding: 0.1 }}
                    minZoom={0.1}
                    maxZoom={2}
                />
            </div>
        </>
    )
}

export default GraphRender;