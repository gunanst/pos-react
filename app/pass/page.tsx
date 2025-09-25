import { hashPassword } from "@/lib/auth";

async function generate() {
    const hashed = await hashPassword("admin123");
    console.log(hashed);
}
generate();