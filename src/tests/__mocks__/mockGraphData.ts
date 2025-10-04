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
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            notes: { type: "string" }
          }
        }
      },
      {
        id: "f_01jk7awbhqewgbkbgk8rjm7bv7",
        name: "test form",
        description: "test",
        field_schema: {
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            notes: { type: "string" }
          }
        }
      },
      {
        id: "f_01jk7aygnqewh8gt8549beb1yc",
        name: "test form",
        description: "test",
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