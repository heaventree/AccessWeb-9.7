import React from 'react';
import { Users, UserPlus, Settings, Shield } from 'lucide-react';
import { TeamMembers } from '../../components/team/TeamMembers';
import { TeamInvites } from '../../components/team/TeamInvites';
import { TeamRoles } from '../../components/team/TeamRoles';
import { TeamPermissions } from '../../components/team/TeamPermissions';

export function TeamPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Team Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage team members, roles, and permissions
          </p>
        </div>

        <div className="space-y-8">
          <TeamMembers />
          <TeamInvites />
          <TeamRoles />
          <TeamPermissions />
        </div>
      </div>
    </div>
  );
}