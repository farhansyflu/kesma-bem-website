import { getTickerItems } from "@/lib/data";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const items = await getTickerItems();
  return <NavbarClient items={items} />;
}
