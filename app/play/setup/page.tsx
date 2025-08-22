"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_NFT, scenarios } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function joinAttributes(attrs: string): string[] {
    return attrs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

export default function SetupPage() {
    const router = useRouter();
    const [name, setName] = useState(DEFAULT_NFT.name);
    const [description, setDescription] = useState(DEFAULT_NFT.bio);
    const [compliance, setCompliance] = useState<number>(DEFAULT_NFT.attributes.compliance);
    const [creativity, setCreativity] = useState<number>(DEFAULT_NFT.attributes.creativity);
    const [motivation, setMotivation] = useState<number>(DEFAULT_NFT.attributes.motivation_to_survive);
    const [unhingedness, setUnhingedness] = useState<number>(DEFAULT_NFT.attributes.unhingedness);

    const canStart = useMemo(() => name.trim().length > 0, [name]);

    const handleStart = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!canStart) return;

            const nft = {
                name,
                bio: description,
                attributes: {
                    compliance,
                    creativity,
                    motivation_to_survive: motivation,
                    unhingedness,
                },
            };

            const allScenarios = scenarios(name);
            const scenario = allScenarios[Math.floor(Math.random() * allScenarios.length)];

            const params = new URLSearchParams({
                name,
                scenario,
                nft: encodeURIComponent(JSON.stringify(nft)),
            });

            router.push(`/play/chat?${params.toString()}`);
        },
        [name, description, compliance, creativity, motivation, unhingedness, canStart, router],
    );

    return (
        <div className="mx-auto max-w-md p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Create your NFT character</h1>
                <p className="text-sm opacity-80">Enter details to begin the survival challenge.</p>
            </div>
            <form onSubmit={handleStart} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Baby Punk" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brave, witty, and impulsive." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <Label htmlFor="compliance">Compliance</Label>
                        <Input id="compliance" type="number" min={0} max={100} value={compliance} onChange={(e) => setCompliance(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="creativity">Creativity</Label>
                        <Input id="creativity" type="number" min={0} max={100} value={creativity} onChange={(e) => setCreativity(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="motivation">Motivation to survive</Label>
                        <Input id="motivation" type="number" min={0} max={100} value={motivation} onChange={(e) => setMotivation(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unhingedness">Unhingedness</Label>
                        <Input id="unhingedness" type="number" min={0} max={100} value={unhingedness} onChange={(e) => setUnhingedness(Number(e.target.value))} />
                    </div>
                </div>
                <Button type="submit" disabled={!canStart} className="w-full">
                    Start Collaboration
                </Button>
            </form>
        </div>
    );
}


