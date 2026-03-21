import Stripe from "stripe";
import { Resource } from "sst";
import { Util } from "@sst-notes/core/util";
import { Billing } from "@sst-notes/core/billing";

export const main = Util.handler(async (event) => {
  const {
    storage, // 用户希望存储在其账户中的笔记数量
    source, // 我们将要扣款的银行卡的 Stripe 令牌
  } = JSON.parse(event.body || "{}");
  // 根据要存储的笔记数量来确定要向用户收取多少费用
  const amount = Billing.compute(storage);
  const description = "Scratch charge";

  const stripe = new Stripe(
    // Load our secret key
    Resource.StripeSecretKey.value,
    { apiVersion: "2026-02-25.clover" }
  );

  // 向用户收费
  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "usd",
  });

  return JSON.stringify({ status: true });
});
