import { describe, it, expect } from "vitest";

describe("Template Validators", () => {
  it("CreateTemplateSchema exists and exports correctly", async () => {
    const { CreateTemplateSchema, UpdateTemplateSchema } = await import(
      "src/validators/template.validator"
    );
    expect(CreateTemplateSchema).toBeDefined();
    expect(UpdateTemplateSchema).toBeDefined();
  });
});

describe("Auth Validators", () => {
  it("RegisterSchema validates correct input", async () => {
    const { RegisterSchema } = await import("src/validators/auth.validator");
    const result = RegisterSchema.safeParse({
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      },
    });
    expect(result.success).toBe(true);
  });

  it("LoginSchema validates correct input", async () => {
    const { LoginSchema } = await import("src/validators/auth.validator");
    const result = LoginSchema.safeParse({
      body: {
        email: "test@example.com",
        password: "password123",
      },
    });
    expect(result.success).toBe(true);
  });
});
