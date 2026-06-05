import { Member, TeamHealth, TeamHealthIssue } from "@/types";
import { CLASS_ROLES } from "@/lib/constants/classes";

/**
 * Check team composition and return health issues
 */
export function checkTeamHealth(teamMembers: Member[], teamId: number): TeamHealth {
    const issues: TeamHealthIssue[] = [];
    const memberCount = teamMembers.length;

    // Check capacity
    if (memberCount < 6) {
        issues.push("under-capacity");
    } else if (memberCount > 6) {
        issues.push("over-capacity");
    }

    // Check for tank
    const hasTank = teamMembers.some(
        (m) => m.class && CLASS_ROLES[m.class] === "tank"
    );
    if (!hasTank && memberCount > 0) {
        issues.push("no-tank");
    }

    // Check for healer
    const hasHealer = teamMembers.some(
        (m) => m.class && CLASS_ROLES[m.class] === "healer"
    );
    if (!hasHealer && memberCount > 0) {
        issues.push("no-healer");
    }

    // Check DPS ratio - if more than 4 DPS, might be too many
    const dpsCount = teamMembers.filter(
        (m) => m.class && CLASS_ROLES[m.class] === "dps"
    ).length;
    if (dpsCount > 4) {
        issues.push("too-many-dps");
    }

    return {
        teamId,
        issues,
        memberCount,
    };
}

/**
 * Get all team health checks for a formation
 */
export function checkAllTeamsHealth(
    allMembers: Member[],
    teams: Array<{ teamId: number; members: string[] }>
): TeamHealth[] {
    return teams.map((team) => {
        const teamMembers = allMembers.filter((m) =>
            team.members.includes(m.id)
        );
        return checkTeamHealth(teamMembers, team.teamId);
    });
}