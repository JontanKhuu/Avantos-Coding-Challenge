import {useEffect, useState} from "react"
import GraphRender, { fetchGraphData } from "./GraphRenderer"
import NodeInfo from "./PrefillUI"
import "./css/App.css"

const App = () => {
    const [graphData, setGraphData] = useState<any | undefined>(undefined)
    const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined)
    const [isNodeInfoOpen, setIsNodeInfoOpen] = useState(false)
    
    // Global data that can be used for prefill mapping
    const [globalData, setGlobalData] = useState<Record<string, any>>({
        userId: 'user123',
        timestamp: new Date().toISOString(),
        sessionId: 'session456',
        companyName: 'Avantos Corp',
        environment: 'development',
        apiVersion: 'v1.0',
        userRole: 'admin',
        region: 'us-east-1',
        language: 'en',
        timezone: 'UTC'
    })

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchGraphData()
                setGraphData(data)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [])

    const handleSelectNode = (nodeId: string) => {
        setSelectedNodeId(nodeId)
        setIsNodeInfoOpen(true)
    }

    const handleUpdateNodeField = (nodeId: string, fieldKey: string, value: any) => {
        setGraphData((prevData: any) => {
            if (!prevData) return prevData;
            
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
    }

    return (
        <div className="app-container">
            <GraphRender 
                graphData={graphData} 
                onSelectNode={handleSelectNode}
                onUpdateNodeField={handleUpdateNodeField}
            />
            <NodeInfo
                graphData={graphData}
                selectedNodeId={selectedNodeId}
                isOpen={isNodeInfoOpen}
                onClose={() => setIsNodeInfoOpen(false)}
                onUpdateNodeField={handleUpdateNodeField}
                globalData={globalData}
            />
        </div>
    )
}

export default App