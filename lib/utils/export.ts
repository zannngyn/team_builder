import { Formation, Member, Division, Lane } from "@/types";

/**
 * Export formation as text format
 */
export function exportFormationAsText(
    formation: Formation,
    allMembers: Member[]
): string {
    let output = `=== ${formation.name} ===\n\n`;

    for (const division of formation.divisions) {
        output += `━━━ DIVISION ${division.divisionId} ━━━\n\n`;

        for (const team of division.teams) {
            const laneStr = team.lane ? ` [${team.lane}]` : "";
            output += `Team ${team.teamId}${laneStr}:\n`;

            if (team.members.length === 0) {
                output += "  (Empty)\n";
            } else {
                for (const memberId of team.members) {
                    const member = allMembers.find((m) => m.id === memberId);
                    if (member) {
                        const className = member.class || "No Class";
                        const tags = member.tags.length > 0 ? ` [${member.tags.join(", ")}]` : "";
                        output += `  • ${member.name} - ${className}${tags}\n`;
                    }
                }
            }
            output += "\n";
        }
    }

    return output;
}

/**
 * Export formation to CSV format
 */
export function exportFormationToCSV(
    divisions: Division[],
    allMembers: Member[],
    formationName: string
): void {
    let csv = "Team,Team Lane,Member Name,Class,Tags\n";

    for (const division of divisions) {
        for (const team of division.teams) {
            const teamLane = team.lane || "Flex";
            for (const memberId of team.members) {
                const member = allMembers.find((m) => m.id === memberId);
                if (member) {
                    const className = member.class || "";
                    const tags = member.tags.join(";");
                    csv += `${team.teamId},"${teamLane}","${member.name}","${className}","${tags}"\n`;
                }
            }
        }
    }

    // Download CSV
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formationName.replace(/[^a-z0-9]/gi, "_")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Import formation from CSV format
 * Note: This function returns member names in the members array.
 * The calling code should resolve these to IDs based on the guild members list.
 */
export function importFormationFromCSV(csvText: string): Division[] {
    const lines = csvText.split("\n").filter((line) => line.trim());
    
    // Set up default team lanes
    const laneDefaults: Record<number, Lane> = {
        1: "Top", 2: "Mid", 3: "Bot", 4: "Flex", 5: "Flex",
        6: "Top", 7: "Mid", 8: "Bot", 9: "Flex", 10: "Flex"
    };

    const divisions: Division[] = [
        { divisionId: 1, teams: [1, 2, 3, 4, 5].map((id) => ({ teamId: id, members: [], lane: laneDefaults[id] })) },
        { divisionId: 2, teams: [6, 7, 8, 9, 10].map((id) => ({ teamId: id, members: [], lane: laneDefaults[id] })) },
    ];

    if (lines.length <= 1) return divisions;

    // Detect format from header
    const headerLine = lines[0].toLowerCase();
    const isNewFormat = headerLine.includes("team lane");

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        
        // Split handling quoted fields properly
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length < 2) continue;

        const teamId = parseInt(parts[0].replace(/"/g, "").trim());
        if (isNaN(teamId)) continue;

        let teamLane: Lane | null = null;
        let memberName = "";

        if (isNewFormat) {
            // New Format: Team,Team Lane,Member Name,Class,Tags
            if (parts.length >= 3) {
                teamLane = parts[1].replace(/"/g, "").trim() as Lane;
                memberName = parts[2].replace(/"/g, "").trim();
            }
        } else {
            // Old Format: Team,Member Name,Class,Lane,Tags
            memberName = parts[1].replace(/"/g, "").trim();
        }

        if (!memberName) continue;

        // Find division and team
        for (const div of divisions) {
            const team = div.teams.find((t) => t.teamId === teamId);
            if (team) {
                team.members.push(memberName as any);
                if (teamLane) {
                    team.lane = teamLane;
                }
            }
        }
    }

    return divisions;
}

/**
 * Export unassigned members
 */
export function exportUnassignedMembers(
    allMembers: Member[],
    formation: Formation
): string {
    const assignedIds = new Set<string>();

    for (const division of formation.divisions) {
        for (const team of division.teams) {
            for (const memberId of team.members) {
                assignedIds.add(memberId);
            }
        }
    }

    const unassigned = allMembers.filter((m) => !assignedIds.has(m.id));

    if (unassigned.length === 0) {
        return "All members assigned!";
    }

    let output = "=== Unassigned Members ===\n\n";

    for (const member of unassigned) {
        const className = member.class || "No Class";
        const lane = member.lane || "";
        output += `• ${member.name} - ${className}${lane ? ` (${lane})` : ""}\n`;
    }

    return output;
}