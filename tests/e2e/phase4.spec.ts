import { expect, test, type Page } from "@playwright/test";

const SECTIONS = [
  { href: "/dashboard", label: "Dashboard", heading: "Welcome back" },
  { href: "/courses", label: "Course Modules", heading: "Course Modules" },
  {
    href: "/materials",
    label: "Learning Materials",
    heading: "Learning Materials",
  },
  { href: "/quizzes", label: "Quizzes", heading: "Quizzes and Assessments" },
  { href: "/progress", label: "Progress", heading: "Progress" },
  { href: "/notes", label: "Notes", heading: "Notes" },
  { href: "/certificates", label: "Certificates", heading: "Certificates" },
];

function uniqueAccount() {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    name: "Asha Rao",
    email: `student${id}@example.com`,
    password: "secret123",
  };
}

async function register(
  page: Page,
  account: { name: string; email: string; password: string },
) {
  await page.goto("/");
  await page.getByRole("tab", { name: "Create account" }).click();
  await page.getByLabel("Full name").fill(account.name);
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByLabel("Confirm password").fill(account.password);
  await page.getByRole("button", { name: "Create account and enter" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Welcome back, Asha",
  );
}

async function signOut(page: Page) {
  if (page.viewportSize()!.width < 1024) {
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("button", { name: /Sign out/ }).click();
  } else {
    await page.getByRole("button", { name: "Sign out" }).click();
  }
  await expect(page).toHaveURL(/\/$/);
}

test.describe("Welcome and branding", () => {
  test("shows the approved welcome message, branding and content attribution", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Welcome to Learning Sphere",
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Learning Sphere", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Content Source: Based on the five course presentations provided for Learning Sphere.",
      ),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("does not show an individual author name or internal class references", async ({
    page,
  }) => {
    await page.goto("/");
    const body = (await page.locator("body").innerText()).toLowerCase();
    for (const forbidden of [
      "fadte",
      "viantos",
      "zenith",
      "pm2-01",
      "pm2-02",
      "chatbot",
      "video lesson",
    ]) {
      expect(body).not.toContain(forbidden);
    }
  });
});

test.describe("Account flows", () => {
  test("registers, lands on the dashboard, and signs out", async ({ page }) => {
    const account = uniqueAccount();
    await register(page, account);
    await signOut(page);
  });

  test("shows validation errors without creating an account", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Create account" }).click();
    await page
      .getByRole("button", { name: "Create account and enter" })
      .click();
    await expect(page.getByText("Please enter your full name")).toBeVisible();
    await expect(
      page.getByText("Please enter a valid email address."),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
  });

  test("rejects a wrong password with a clear message", async ({ page }) => {
    const account = uniqueAccount();
    await register(page, account);
    await signOut(page);

    await page.getByLabel("Email").fill(account.email);
    await page.getByLabel("Password").fill("wrong999");
    await page
      .getByRole("button", { name: "Sign in and enter dashboard" })
      .click();
    await expect(page.locator('form p[role="alert"]')).toHaveText(
      "Incorrect email or password.",
    );
    await expect(page).toHaveURL(/\/$/);
  });

  test("signs in with the correct password", async ({ page }) => {
    const account = uniqueAccount();
    await register(page, account);
    await signOut(page);

    await page.getByLabel("Email").fill(account.email);
    await page.getByLabel("Password").fill(account.password);
    await page
      .getByRole("button", { name: "Sign in and enter dashboard" })
      .click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("protects section pages from signed-out visitors", async ({ page }) => {
    await page.goto("/quizzes");
    await expect(page).toHaveURL(/\/$/);
  });

  test("shows an Enter Learning Dashboard button when already signed in", async ({
    page,
  }) => {
    await register(page, uniqueAccount());
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Enter Learning Dashboard" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Enter Learning Dashboard" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await register(page, uniqueAccount());
  });

  for (const section of SECTIONS) {
    test(`opens ${section.href} with its heading`, async ({
      page,
    }, testInfo) => {
      if (testInfo.project.name === "mobile") {
        await page.getByRole("button", { name: "Menu" }).click();
        await page
          .getByRole("navigation", { name: "Mobile navigation" })
          .getByRole("link", { name: section.label, exact: true })
          .click();
      } else {
        await page
          .getByRole("navigation", { name: "Main navigation" })
          .locator(`a[href="${section.href}"]`)
          .click();
      }
      await expect(page).toHaveURL(new RegExp(`${section.href}$`));
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        section.heading,
      );
    });
  }

  test("marks the current section as the active navigation item", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile",
      "Desktop sidebar is always visible only on desktop widths",
    );
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .locator('a[href="/notes"]')
      .click();
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .locator('a[href="/notes"]'),
    ).toHaveAttribute("aria-current", "page");
  });

  test("mobile menu opens and closes", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "Mobile-only behaviour");
    const menuButton = page.getByRole("button", { name: "Menu" });
    await menuButton.click();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toHaveCount(0);
  });
});
