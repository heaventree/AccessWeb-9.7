import React, { useState } from 'react';
import { Users, UserPlus, Settings, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TeamMembers } from '../../components/team/TeamMembers';
import { TeamInvites } from '../../components/team/TeamInvites';
import { TeamRoles } from '../../components/team/TeamRoles';
import { TeamPermissions } from '../../components/team/TeamPermissions';

export function TeamPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'invites' | 'roles' | 'permissions'>('members');
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex items-center">
            <Link to="/my-account" className="mr-4 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('members')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'members'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-5 h-5 inline-block mr-2" />
              Team Members
            </button>
            <button
              onClick={() => setActiveTab('invites')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invites'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserPlus className="w-5 h-5 inline-block mr-2" />
              Invitations
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="w-5 h-5 inline-block mr-2" />
              Roles
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'permissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield className="w-5 h-5 inline-block mr-2" />
              Permissions
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'members' && (
            <TeamMembers />
          )}
          
          {activeTab === 'invites' && (
            <TeamInvites />
          )}
          
          {activeTab === 'roles' && (
            <TeamRoles />
          )}
          
          {activeTab === 'permissions' && (
            <TeamPermissions />
          )}
        </div>
      </div>
    </div>
  );
}