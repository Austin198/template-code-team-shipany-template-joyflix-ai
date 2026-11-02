'use client';

import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { WorkspaceRecentCreations } from '@/components/sites/workspace/WorkspaceRecentCreations';

interface CreationsSearch {
  page?: number;
}

export const Route = createFileRoute('/settings/creations')({
  validateSearch: (search: Record<string, unknown>): CreationsSearch => ({
    page: search.page ? Number(search.page) : undefined,
  }),
  component: SettingsCreationsPage,
});

/**
 * 个人中心 - 历史创作资产管理页面 (/settings/creations)
 * 复用 WorkspaceRecentCreations 组件，统一全站作品卡片展示与管理
 */
function SettingsCreationsPage() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const page = Math.max(1, Number(search.page) || 1);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <WorkspaceRecentCreations
        isSettingsPage
        filterMediaType="video"
        page={page}
        onPageChange={(nextPage) => {
          navigate({
            search: (prev) => ({
              ...prev,
              page: nextPage <= 1 ? undefined : nextPage,
            }),
            replace: true,
          });
        }}
      />
    </div>
  );
}
