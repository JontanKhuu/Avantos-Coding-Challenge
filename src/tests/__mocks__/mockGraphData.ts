// src/tests/__mocks__/mockGraphData.ts
export const mockGraphData = {
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
            notes: "Initial user registration",
            multi_select: ["foo", "bar"],
            dynamic_checkbox_group: ["foo"],
            dynamic_object: { title: "Sample Object" },
            button: { title: "Submit" }
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
            id: "", // Empty field for testing
            name: "Jane Smith",
            email: "", // Empty field for testing
            notes: "Contact information form",
            multi_select: ["foobar"],
            dynamic_checkbox_group: ["bar"],
            dynamic_object: {},
            button: { title: "Save" }
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
            notes: "Additional processing form",
            multi_select: ["foo", "bar", "foobar"],
            dynamic_checkbox_group: ["foo", "bar"],
            dynamic_object: { title: "Foo" },
            button: { title: "Process" }
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
            notes: "Review and approval form",
            multi_select: ["bar"],
            dynamic_checkbox_group: ["foobar"],
            dynamic_object: { title: "Review Object" },
            button: { title: "Approve" }
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
            id: "", // Empty - target for prefill testing
            name: "", // Empty - target for prefill testing
            email: "", // Empty - target for prefill testing
            notes: "", // Empty - target for prefill testing
            multi_select: [],
            dynamic_checkbox_group: [],
            dynamic_object: {},
            button: { title: "Final Submit" }
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
            id: "", // Empty - final target for testing
            name: "", // Empty - final target for testing
            email: "", // Empty - final target for testing
            notes: "", // Empty - final target for testing
            multi_select: [],
            dynamic_checkbox_group: [],
            dynamic_object: {},
            button: { title: "Complete" }
          }
        },
        position: { x: 1437, y: 264 }
      }
    ],
    forms: [
      {
        id: "f_01jk7ap2r3ewf9gx6a9r09gzjv",
        name: "test form",
        description: "test",
        field_schema: {
          type: "object",
          properties: {
            button: {
              avantos_type: "button",
              title: "Button",
              type: "object"
            },
            dynamic_checkbox_group: {
              avantos_type: "checkbox-group",
              items: {
                enum: ["foo", "bar", "foobar"],
                type: "string"
              },
              type: "array",
              uniqueItems: true
            },
            dynamic_object: {
              avantos_type: "object-enum",
              enum: null,
              title: "Dynamic Object",
              type: "object"
            },
            email: {
              avantos_type: "short-text",
              format: "email",
              title: "Email",
              type: "string"
            },
            id: {
              avantos_type: "short-text",
              title: "ID",
              type: "string"
            },
            multi_select: {
              avantos_type: "multi-select",
              items: {
                enum: ["foo", "bar", "foobar"],
                type: "string"
              },
              type: "array",
              uniqueItems: true
            },
            name: {
              avantos_type: "short-text",
              title: "Name",
              type: "string"
            },
            notes: {
              avantos_type: "multi-line-text",
              title: "Notes",
              type: "string"
            }
          },
          required: ["id", "name", "email"]
        }
      },
      {
        id: "f_01jk7awbhqewgbkbgk8rjm7bv7",
        name: "test form",
        description: "test",
        field_schema: {
          type: "object",
          properties: {
            button: {
              avantos_type: "button",
              title: "Button",
              type: "object"
            },
            dynamic_checkbox_group: {
              avantos_type: "checkbox-group",
              items: {
                enum: ["foo", "bar", "foobar"],
                type: "string"
              },
              type: "array",
              uniqueItems: true
            },
            dynamic_object: {
              avantos_type: "object-enum",
              enum: [],
              title: "Dynamic Object",
              type: "object"
            },
            email: {
              avantos_type: "short-text",
              format: "email",
              title: "Email",
              type: "string"
            },
            id: {
              avantos_type: "short-text",
              title: "ID",
              type: "string"
            },
            multi_select: {
              avantos_type: "multi-select",
              items: {
                enum: ["foo", "bar", "foobar"],
                type: "string"
              },
              type: "array",
              uniqueItems: true
            },
            name: {
              avantos_type: "short-text",
              title: "Name",
              type: "string"
            },
            notes: {
              avantos_type: "multi-line-text",
              title: "Notes",
              type: "string"
            }
          },
          required: ["id", "name", "email"]
        }
      },
      {
        id: "f_01jk7aygnqewh8gt8549beb1yc",
        name: "test form",
        description: "test",
        field_schema: {
          type: "object",
          properties: {
            button: {
              avantos_type: "button",
              title: "Button",
              type: "object"
            },
            dynamic_checkbox_group: {
              avantos_type: "checkbox-group",
              items: {
                enum: ["foo", "bar", "foobar"],
                type: "string"
              },
              type: "array",
              uniqueItems: true
            },
            dynamic_object: {
              avantos_type: "object-enum",
              enum: [{ title: "Foo" }],
              title: "Dynamic Object",
              type: "object"
            },
            email: {
              avantos_type: "short-text",
              format: "email",
              title: "Email",
              type: "string"
            },
            id: {
              avantos_type: "short-text",
              title: "ID",
              type: "string"
            },
            multi_select: {
              avantos_type: "multi-select",
              items: {
                enum: ["foo", "bar", "foobar"],
                type: "string"
              },
              type: "array",
              uniqueItems: true
            },
            name: {
              avantos_type: "short-text",
              title: "Name",
              type: "string"
            },
            notes: {
              avantos_type: "multi-line-text",
              title: "Notes",
              type: "string"
            }
          },
          required: ["id", "name", "email"]
        }
      }
    ],
    edges: [
      {
        source: "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88",
        target: "form-a4750667-d774-40fb-9b0a-44f8539ff6c4"
      },
      {
        source: "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88",
        target: "form-7c26f280-7bff-40e3-b9a5-0533136f52c3"
      },
      {
        source: "form-a4750667-d774-40fb-9b0a-44f8539ff6c4",
        target: "form-0f58384c-4966-4ce6-9ec2-40b96d61f745"
      },
      {
        source: "form-7c26f280-7bff-40e3-b9a5-0533136f52c3",
        target: "form-e15d42df-c7c0-4819-9391-53730e6d47b3"
      },
      {
        source: "form-0f58384c-4966-4ce6-9ec2-40b96d61f745",
        target: "form-bad163fd-09bd-4710-ad80-245f31b797d5"
      },
      {
        source: "form-e15d42df-c7c0-4819-9391-53730e6d47b3",
        target: "form-bad163fd-09bd-4710-ad80-245f31b797d5"
      }
    ]
  };
  
  export const mockGlobalData = {
    userId: 'user123',
    timestamp: new Date().toISOString(),
    sessionId: 'session456',
    companyName: 'Avantos Corp',
    environment: 'development',
    apiVersion: 'v1.0',
    userRole: 'admin',
    region: 'us-east-1',
    language: 'en',
    timezone: 'UTC',
    // Additional fields that might be useful for testing
    customerId: 'cust-789',
    workflowId: 'wf-456',
    processId: 'proc-123'
  };
  
  // Test scenarios for different prefill situations
  export const testScenarios = {
    // Scenario 1: Form E (empty) should be able to get data from Form A (has data)
    formEWithDataFromA: {
      targetNodeId: "form-e15d42df-c7c0-4819-9391-53730e6d47b3", // Form E
      sourceNodeId: "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88", // Form A
      fieldToMap: "email",
      expectedSourceDisplay: "Form A.email",
      expectedValue: "john.doe@example.com"
    },
    
    // Scenario 2: Form E should be able to get data from Form B (has some empty fields)
    formEWithDataFromB: {
      targetNodeId: "form-e15d42df-c7c0-4819-9391-53730e6d47b3", // Form E
      sourceNodeId: "form-a4750667-d774-40fb-9b0a-44f8539ff6c4", // Form B
      fieldToMap: "name",
      expectedSourceDisplay: "Form B.name",
      expectedValue: "Jane Smith"
    },
    
    // Scenario 3: Form F should be able to get data from Form D (non-immediate upstream)
    formFWithDataFromD: {
      targetNodeId: "form-bad163fd-09bd-4710-ad80-245f31b797d5", // Form F
      sourceNodeId: "form-0f58384c-4966-4ce6-9ec2-40b96d61f745", // Form D
      fieldToMap: "email",
      expectedSourceDisplay: "Form D.email",
      expectedValue: "alice.brown@example.com"
    },
    
    // Scenario 4: Test empty field mapping (should still show source node name)
    formEWithEmptyFieldFromB: {
      targetNodeId: "form-e15d42df-c7c0-4819-9391-53730e6d47b3", // Form E
      sourceNodeId: "form-a4750667-d774-40fb-9b0a-44f8539ff6c4", // Form B
      fieldToMap: "email", // Form B has empty email
      expectedSourceDisplay: "Form B.email",
      expectedValue: ""
    }
  };
  
  // Helper function to get a specific node by name
  export const getNodeByName = (graphData: typeof mockGraphData, name: string) => {
    return graphData.nodes.find(node => node.data.name === name);
  };
  
  // Helper function to get a specific form by id
  export const getFormById = (graphData: typeof mockGraphData, id: string) => {
    return graphData.forms.find(form => form.id === id);
  };