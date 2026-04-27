This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Demo Strategy: Pick-Up First

The primary flow for demo day is pick-up, not delivery. This maps to how Simba actually operates and ensures clear logistics for the demonstration.

### How it works:
1.  **Browse & Cart:** User browses the catalog and adds items to their cart.
2.  **Branch & Time Selection:** User selects one of the 9 real Kigali branches and a specific pick-up time.
3.  **MoMo Deposit:** User pays a small MoMo deposit (500 RWF) at checkout to prevent no-shows and protect staff time.
4.  **Immediate Fulfillment:** The order is sent to the specific branch immediately; staff can then start preparation.
5.  **Completion:** User arrives at the branch and picks up their order.

### Real Kigali Simba Branches:
*   Simba Supermarket Remera
*   Simba Supermarket Kimironko
*   Simba Supermarket Kacyiru
*   Simba Supermarket Nyamirambo
*   Simba Supermarket Gikondo
*   Simba Supermarket Kanombe
*   Simba Supermarket Kinyinya
*   Simba Supermarket Kibagabaga
*   Simba Supermarket Nyanza

### MoMo Deposit: Protecting Branch Staff Time
To prevent "no-shows" where staff pack orders that are never collected, the system enforces a small non-refundable deposit (500 RWF) via Mobile Money at checkout.
*   **UX Implementation:** The checkout flow explicitly informs the user: "Your order requires a 500 RWF deposit to confirm."
*   **Demo Implementation:** A mock payment screen simulates the MoMo prompt and verification flow to demonstrate the UX without requiring live API keys.

### Branch Operations: Order Flow
The system includes a dedicated Management Portal with role-based access to manage the fulfillment lifecycle:
1.  **Pending:** Customer places order; it appears in the Branch Dashboard.
2.  **Accepted & Assigned:** The **Branch Manager** reviews pending orders and assigns them to a specific **Branch Staff** member.
3.  **Preparing:** The assigned **Branch Staff** starts preparing the order (status: `preparing`).
4.  **Ready for Pick-up:** Staff marks the order as `ready`.
5.  **Completed:** When the customer arrives and pays the balance, the order is marked `completed`.

**Roles:**
*   **Branch Manager:** Oversight of all branch orders; responsible for staff assignment.
*   **Branch Staff:** Focuses on assigned tasks; manages the preparation and "ready" states.

### Inventory: Branch-Level Stock
Stock is tracked independently for each of the 9 branches:
*   **Isolated Inventory:** Placing an order at the Remera branch decrements stock only for Remera; other branches remain unaffected.
*   **Real-time Updates:** When an order is placed, the system automatically adjusts the `BranchStock` for the selected items.
*   **Manual Control:** Branch staff can manually update stock levels or mark items as "Out of Stock" via the Management Portal to reflect local availability.

### Reviews & Trust: Two Directions
Trust is a two-way street in Simba 2.0:
1.  **Customer to Branch:** After picking up an order, customers can rate their experience (1-5 stars) and leave a review. These ratings are aggregated and displayed during the branch selection process to help other users choose the best location.
2.  **Branch to Customer (Flagging):** If a customer fails to show up for an order, branch staff can flag the account as a "No-Show."
    *   **Penalty System:** To protect staff time, accounts with "No-Show" flags are marked as "High Risk" and are required to pay a significantly higher MoMo deposit for future orders.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
