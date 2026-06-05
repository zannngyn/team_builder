import { create } from "zustand";
import { Member, Class, Lane, MemberTag, Formation, Division, Team } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { parseRosterText, parseRosterTextWithClass } from "@/lib/utils/validation";
import { SAMPLE_ROSTER } from "@/lib/constants/sampleRoster";
import { CLASS_ROLES } from "@/lib/constants/classes";

interface PaintMode {
    active: boolean;
    selectedClass: Class | null;
}

interface FormationState {
    guildMembers: Member[];
    formation: Formation | null;
    selectedTeamId: number | null;
    paintMode: PaintMode;
    laneView: boolean;

    // General Actions
    loadFromLocalStorage: () => void;

    // Guild Members actions
    importGuildMembers: (text: string) => void;
    loadSampleRoster: () => void;
    addMember: (name: string) => void;
    removeMember: (id: string) => void;
    updateMemberClass: (id: string, cls: Class | null) => void;
    updateMemberLane: (id: string, lane: Lane | null) => void;
    updateMemberSkills: (id: string, skills: string[]) => void;
    toggleMemberTag: (id: string, tag: MemberTag) => void;
    clearAllGuildMembers: () => void;
    removeAllFromTeams: () => void;

    // Paint mode actions
    togglePaintMode: () => void;
    setPaintClass: (cls: Class | null) => void;
    paintMember: (id: string) => void;

    // Formation actions
    initFormation: (name: string) => void;
    assignToTeam: (memberId: string, teamId: number, position?: number) => void;
    removeFromTeam: (memberId: string) => void;
    selectTeam: (teamId: number | null) => void;
    clearAllTeams: () => void;
    importFormation: (divisions: Division[]) => void;
    autoArrangeTeams: () => void;
    toggleLaneView: () => void;
    updateTeamLane: (teamId: number, lane: Lane | null) => void;
    updateMemberName: (memberId: string, newName: string) => void;
    updateTeamName: (teamId: number, newName: string) => void;
    updateLaneName: (lane: Lane, newName: string) => void;

    // Getters
    getUnassignedMembers: () => Member[];
    getTeamMembers: (teamId: number) => (Member | null)[];
}

function createEmptyFormation(name: string): Formation {
    return {
        guildId: "",
        guildMembersId: "",
        name,
        divisions: [
            {
                divisionId: 1,
                teams: [
                    { teamId: 1, members: [], lane: "Top" },
                    { teamId: 2, members: [], lane: "Mid" },
                    { teamId: 3, members: [], lane: "Bot" },
                    { teamId: 4, members: [], lane: "Flex" },
                    { teamId: 5, members: [], lane: "Flex" },
                ],
            },
            {
                divisionId: 2,
                teams: [
                    { teamId: 6, members: [], lane: "Top" },
                    { teamId: 7, members: [], lane: "Mid" },
                    { teamId: 8, members: [], lane: "Bot" },
                    { teamId: 9, members: [], lane: "Flex" },
                    { teamId: 10, members: [], lane: "Flex" },
                ],
            },
        ],
        laneNames: { Top: "Top", Mid: "Mid", Bot: "Bot", Flex: "Flex" }
    };
}

export const useFormationStore = create<FormationState>((set, get) => ({
    guildMembers: [],
    formation: null,
    selectedTeamId: null,
    paintMode: { active: false, selectedClass: null },
    laneView: false,

    loadFromLocalStorage: () => {
        if (typeof window === "undefined") return;
        const savedMembers = localStorage.getItem("sow_guild_members");
        const savedFormation = localStorage.getItem("sow_formation");

        let formation = savedFormation ? JSON.parse(savedFormation) : null;
        if (formation) {
            if (formation.divisions) {
                // Migrate old configurations to include team lanes
                formation.divisions = formation.divisions.map((div: any) => ({
                    ...div,
                    teams: div.teams.map((team: any) => {
                        if (team.lane === undefined) {
                            const laneDefaults: Record<number, Lane> = {
                                1: "Top", 2: "Mid", 3: "Bot", 4: "Flex", 5: "Flex",
                                6: "Top", 7: "Mid", 8: "Bot", 9: "Flex", 10: "Flex"
                            };
                            return { ...team, lane: laneDefaults[team.teamId] || "Flex" };
                        }
                        return team;
                    })
                }));
            }
            if (!formation.laneNames) {
                formation.laneNames = { Top: "Top", Mid: "Mid", Bot: "Bot", Flex: "Flex" };
            }
        } else if (!formation) {
            formation = createEmptyFormation("New Guild Formation");
        }

        set({
            guildMembers: savedMembers ? JSON.parse(savedMembers) : [],
            formation
        });
    },

    importGuildMembers: (text: string) => {
        const parsed = parseRosterTextWithClass(text);
        const members: Member[] = parsed.map((item) => ({
            id: uuidv4(),
            name: item.name,
            class: item.class,
            lane: null,
            tags: [],
            notes: "",
            skills: [],
        }));
        set({ guildMembers: members });
        if (typeof window !== "undefined") {
            localStorage.setItem("sow_guild_members", JSON.stringify(members));
        }
    },

    loadSampleRoster: () => {
        const classes: Class[] = [
            "Thiết Y",
            "Toái Mộng",
            "Huyết Hà",
            "Cửu Linh",
            "Tố Vấn",
            "Thần Tương",
            "Long Ngâm",
        ];

        // Take exactly 80 names
        const namesToUse = SAMPLE_ROSTER.slice(0, 80);

        const members: Member[] = namesToUse.map((name, index) => ({
            id: uuidv4(),
            name,
            class: classes[index % classes.length],
            lane: null,
            tags: [],
            notes: "",
            skills: [],
        }));

        set({ guildMembers: members });
        if (typeof window !== "undefined") {
            localStorage.setItem("sow_guild_members", JSON.stringify(members));
        }
    },

    addMember: (name: string) => {
        const member: Member = {
            id: uuidv4(),
            name,
            class: null,
            lane: null,
            tags: [],
            notes: "",
            skills: [],
        };
        set((state) => {
            const updated = [...state.guildMembers, member];
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_guild_members", JSON.stringify(updated));
            }
            return { guildMembers: updated };
        });
    },

    clearAllGuildMembers: () => {
        // Wipe all members AND reset formation slots, clear localStorage
        const emptyFormation = createEmptyFormation(
            get().formation?.name || "New Guild Formation"
        );
        set({ guildMembers: [], formation: emptyFormation });
        if (typeof window !== "undefined") {
            localStorage.removeItem("sow_guild_members");
            localStorage.setItem("sow_formation", JSON.stringify(emptyFormation));
        }
    },

    removeAllFromTeams: () => {
        set((state) => {
            if (!state.formation) return state;
            // Keep all members but empty every team's members array
            const newDivisions = state.formation.divisions.map((div) => ({
                ...div,
                teams: div.teams.map((team) => ({ ...team, members: [] })),
            }));
            const updatedFormation = { ...state.formation, divisions: newDivisions };
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_formation", JSON.stringify(updatedFormation));
            }
            return { formation: updatedFormation };
        });
    },

    removeMember: (id: string) => {
        set((state) => {
            const updated = state.guildMembers.filter((m) => m.id !== id);

            // Also remove from formation if assigned
            let updatedFormation = state.formation;
            if (state.formation) {
                const newDivisions = state.formation.divisions.map((div) => ({
                    ...div,
                    teams: div.teams.map((team) => ({
                        ...team,
                        members: team.members.filter((mId) => mId !== id),
                    })),
                }));
                updatedFormation = { ...state.formation, divisions: newDivisions };
                if (typeof window !== "undefined") {
                    localStorage.setItem("sow_formation", JSON.stringify(updatedFormation));
                }
            }

            if (typeof window !== "undefined") {
                localStorage.setItem("sow_guild_members", JSON.stringify(updated));
            }
            return { guildMembers: updated, formation: updatedFormation };
        });
    },

    updateMemberClass: (id: string, cls: Class | null) => {
        set((state) => {
            const updated = state.guildMembers.map((m) =>
                m.id === id ? { ...m, class: cls } : m
            );
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_guild_members", JSON.stringify(updated));
            }
            return { guildMembers: updated };
        });
    },

    updateMemberLane: (id: string, lane: Lane | null) => {
        set((state) => {
            const updated = state.guildMembers.map((m) =>
                m.id === id ? { ...m, lane } : m
            );
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_guild_members", JSON.stringify(updated));
            }
            return { guildMembers: updated };
        });
    },

    updateMemberSkills: (id: string, skills: string[]) => {
        set((state) => {
            const updated = state.guildMembers.map((m) =>
                m.id === id ? { ...m, skills: skills.slice(0, 3) } : m
            );
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_guild_members", JSON.stringify(updated));
            }
            return { guildMembers: updated };
        });
    },

    toggleMemberTag: (id: string, tag: MemberTag) => {
        set((state) => {
            const updated = state.guildMembers.map((m) => {
                if (m.id !== id) return m;
                const tags = m.tags.includes(tag)
                    ? m.tags.filter((t) => t !== tag)
                    : [...m.tags, tag];
                return { ...m, tags };
            });
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_guild_members", JSON.stringify(updated));
            }
            return { guildMembers: updated };
        });
    },

    togglePaintMode: () => {
        set((state) => ({
            paintMode: {
                ...state.paintMode,
                active: !state.paintMode.active,
            },
        }));
    },

    setPaintClass: (cls: Class | null) => {
        set((state) => ({
            paintMode: { ...state.paintMode, selectedClass: cls },
        }));
    },

    paintMember: (id: string) => {
        const { paintMode } = get();
        if (!paintMode.active || !paintMode.selectedClass) return;
        get().updateMemberClass(id, paintMode.selectedClass);
    },

    initFormation: (name: string) => {
        const newFormation = createEmptyFormation(name);
        set({ formation: newFormation });
        if (typeof window !== "undefined") {
            localStorage.setItem("sow_formation", JSON.stringify(newFormation));
        }
    },

    assignToTeam: (memberId: string, teamId: number, position?: number) => {
        set((state) => {
            if (!state.formation) return state;

            // Remove from any team first to prevent duplicate assignments
            const newDivisions = state.formation.divisions.map((div) => ({
                ...div,
                teams: div.teams.map((team) => ({
                    ...team,
                    members: team.members.filter((id) => id !== memberId),
                })),
            }));

            // Add to target team at specific position
            for (const div of newDivisions) {
                for (const team of div.teams) {
                    if (team.teamId === teamId) {
                        if (!team.members.includes(memberId)) {
                            // If position is provided and valid (0-5 for 6 slots)
                            if (position !== undefined && position >= 0 && position < 6) {
                                // Pad array with empty placeholders if needed to reach the position
                                while (team.members.length < position) {
                                    team.members.push("");
                                }
                                // Now insert at the desired position
                                team.members.splice(position, 0, memberId);
                                // Remove empty placeholders that exceed 6 slots
                                if (team.members.length > 6) {
                                    team.members = team.members.slice(0, 6);
                                }
                            } else {
                                // Push to the end (backward compatibility)
                                team.members.push(memberId);
                            }
                        }
                    }
                }
            }

            const updatedFormation = { ...state.formation, divisions: newDivisions };
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_formation", JSON.stringify(updatedFormation));
            }
            return {
                formation: updatedFormation,
            };
        });
    },

    removeFromTeam: (memberId: string) => {
        set((state) => {
            if (!state.formation) return state;

            const newDivisions = state.formation.divisions.map((div) => ({
                ...div,
                teams: div.teams.map((team) => ({
                    ...team,
                    members: team.members.filter((id) => id !== memberId),
                })),
            }));

            const updatedFormation = { ...state.formation, divisions: newDivisions };
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_formation", JSON.stringify(updatedFormation));
            }
            return {
                formation: updatedFormation,
            };
        });
    },

    selectTeam: (teamId: number | null) => {
        set({ selectedTeamId: teamId });
    },

    clearAllTeams: () => {
        set((state) => {
            if (!state.formation) return state;
            const updatedFormation = createEmptyFormation(state.formation.name);
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_formation", JSON.stringify(updatedFormation));
            }
            return {
                formation: updatedFormation,
            };
        });
    },

    importFormation: (divisions: Division[]) => {
        set((state) => {
            if (!state.formation) return state;
            const updatedFormation = { ...state.formation, divisions };
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_formation", JSON.stringify(updatedFormation));
            }
            return {
                formation: updatedFormation,
            };
        });
    },

    toggleLaneView: () => {
        set((state) => ({ laneView: !state.laneView }));
    },

    autoArrangeTeams: () => {
        const { guildMembers, formation } = get();
        if (!formation) return;

        // Group members by roles
        const tanks: Member[] = [];
        const healers: Member[] = [];
        const dps: Member[] = [];
        const unassigned: Member[] = [];

        guildMembers.forEach((m) => {
            if (!m.class) {
                unassigned.push(m);
            } else {
                const role = CLASS_ROLES[m.class];
                if (role === "tank") tanks.push(m);
                else if (role === "healer") healers.push(m);
                else dps.push(m);
            }
        });

        // Initialize 10 teams (teamId 1 to 10), each with max 6 slots
        const newTeams: Record<number, string[]> = {};
        for (let i = 1; i <= 10; i++) {
            newTeams[i] = [];
        }

        // 1. Distribute tanks (max 1 per team)
        let tankIdx = 0;
        for (let i = 1; i <= 10 && tankIdx < tanks.length; i++) {
            newTeams[i].push(tanks[tankIdx].id);
            tankIdx++;
        }

        // 2. Distribute healers (max 1 per team)
        let healerIdx = 0;
        for (let i = 1; i <= 10 && healerIdx < healers.length; i++) {
            newTeams[i].push(healers[healerIdx].id);
            healerIdx++;
        }

        // 3. Put any remaining tanks/healers, all DPS, and unassigned players into a general pool
        const fillers: Member[] = [
            ...tanks.slice(tankIdx),
            ...healers.slice(healerIdx),
            ...dps,
            ...unassigned
        ];

        // 4. Fill teams up to 6 members using the fillers pool
        let fillerIdx = 0;
        for (let i = 1; i <= 10; i++) {
            while (newTeams[i].length < 6 && fillerIdx < fillers.length) {
                newTeams[i].push(fillers[fillerIdx].id);
                fillerIdx++;
            }
        }

        // 5. Update divisions
        const newDivisions = formation.divisions.map((div) => ({
            ...div,
            teams: div.teams.map((team) => {
                const laneDefaults: Record<number, Lane> = {
                    1: "Top", 2: "Mid", 3: "Bot", 4: "Flex", 5: "Flex",
                    6: "Top", 7: "Mid", 8: "Bot", 9: "Flex", 10: "Flex"
                };
                return {
                    ...team,
                    members: newTeams[team.teamId] || [],
                    lane: laneDefaults[team.teamId] || "Flex"
                };
            }),
        }));

        const updatedFormation = { ...formation, divisions: newDivisions };
        set({ formation: updatedFormation });

        if (typeof window !== "undefined") {
            localStorage.setItem("sow_formation", JSON.stringify(updatedFormation));
        }
    },

    updateTeamLane: (teamId: number, lane: Lane | null) => {
        set((state) => {
            if (!state.formation) return state;
            const newDivisions = state.formation.divisions.map((div) => ({
                ...div,
                teams: div.teams.map((team) =>
                    team.teamId === teamId ? { ...team, lane } : team
                ),
            }));
            const updatedFormation = { ...state.formation, divisions: newDivisions };
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_formation", JSON.stringify(updatedFormation));
            }
            return {
                formation: updatedFormation,
            };
        });
    },

    updateMemberName: (memberId: string, newName: string) => {
        set((state) => {
            const updated = state.guildMembers.map((m) =>
                m.id === memberId ? { ...m, name: newName } : m
            );
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_guild_members", JSON.stringify(updated));
            }
            return { guildMembers: updated };
        });
    },

    updateTeamName: (teamId: number, newName: string) => {
        set((state) => {
            if (!state.formation) return state;
            const newDivisions = state.formation.divisions.map((div) => ({
                ...div,
                teams: div.teams.map((team) =>
                    team.teamId === teamId ? { ...team, name: newName } : team
                ),
            }));
            const updatedFormation = { ...state.formation, divisions: newDivisions };
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_formation", JSON.stringify(updatedFormation));
            }
            return { formation: updatedFormation };
        });
    },

    updateLaneName: (lane: Lane, newName: string) => {
        set((state) => {
            if (!state.formation) return state;
            const updatedLaneNames = {
                ...(state.formation.laneNames || { Top: "Top", Mid: "Mid", Bot: "Bot", Flex: "Flex" }),
                [lane]: newName
            };
            const updatedFormation = { ...state.formation, laneNames: updatedLaneNames };
            if (typeof window !== "undefined") {
                localStorage.setItem("sow_formation", JSON.stringify(updatedFormation));
            }
            return { formation: updatedFormation };
        });
    },

    getUnassignedMembers: () => {
        const { guildMembers, formation } = get();
        if (!formation) return guildMembers;

        const assignedIds = new Set<string>();
        for (const div of formation.divisions) {
            for (const team of div.teams) {
                for (const id of team.members) {
                    assignedIds.add(id);
                }
            }
        }

        return guildMembers.filter((m) => !assignedIds.has(m.id));
    },

    getTeamMembers: (teamId: number) => {
        const { guildMembers, formation } = get();
        if (!formation) return [];

        for (const div of formation.divisions) {
            for (const team of div.teams) {
                if (team.teamId === teamId) {
                    // Map member IDs to member objects, preserving positions
                    // Empty string placeholders become null to preserve sparse positions
                    return team.members.map((memberId) => {
                        if (memberId === "") return null;
                        return guildMembers.find((m) => m.id === memberId) || null;
                    });
                }
            }
        }

        return [];
    },
}));