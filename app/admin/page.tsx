'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Film, 
  Tv, 
  Users, 
  Subtitles, 
  TrendingUp,
  Plus,
  Settings,
  BarChart3 
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function fetchDashboardStats() {
  const [moviesRes, seriesRes, peopleRes, subtitlesRes] = await Promise.all([
    fetch('/api/movies'),
    fetch('/api/series'),
    fetch('/api/people'),
    fetch('/api/subtitles'),
  ]);

  const [movies, series, people, subtitles] = await Promise.all([
    moviesRes.json(),
    seriesRes.json(), 
    peopleRes.json(),
    subtitlesRes.json(),
  ]);

  return {
    moviesCount: movies.data?.length || 0,
    seriesCount: series.data?.length || 0,
    peopleCount: people.data?.length || 0,
    subtitlesCount: subtitles.data?.length || 0,
    publishedMovies: movies.data?.filter((m: any) => m.published).length || 0,
    publishedSeries: series.data?.filter((s: any) => s.published).length || 0,
    totalEpisodes: series.data?.reduce((acc: number, s: any) => 
      acc + s.seasons.reduce((seasonAcc: number, season: any) => 
        seasonAcc + season.episodes.length, 0), 0) || 0,
  };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-800 rounded w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Movies',
      value: stats?.moviesCount || 0,
      subtitle: `${stats?.publishedMovies || 0} published`,
      icon: Film,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
    },
    {
      title: 'Total Series',
      value: stats?.seriesCount || 0,
      subtitle: `${stats?.publishedSeries || 0} published`,
      icon: Tv,
      color: 'text-red-600',
      bgColor: 'bg-red-600/10',
    },
    {
      title: 'Episodes',
      value: stats?.totalEpisodes || 0,
      subtitle: 'Across all series',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-600/10',
    },
    {
      title: 'People',
      value: stats?.peopleCount || 0,
      subtitle: 'Cast & crew',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-600/10',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Movie',
      description: 'Create a new movie entry',
      href: '/admin/content/movies/new',
      icon: Film,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Add New Series',
      description: 'Create a new TV series',
      href: '/admin/content/series/new',
      icon: Tv,
      color: 'bg-red-600 hover:bg-red-700',
    },
    {
      title: 'Manage People',
      description: 'Add cast and crew',
      href: '/admin/people',
      icon: Users,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Scraper Configs',
      description: 'Manage web scrapers',
      href: '/admin/scraper',
      icon: Settings,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {session.user.name || session.user.email}
            </p>
          </div>
          <Badge variant="secondary" className="bg-blue-600 text-white">
            Admin
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title} className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-gray-300 text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-white">
                  {stat.value.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${action.color} transition-colors`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-gray-200 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                  Activity tracking coming soon
                </h3>
                <p className="text-gray-500">
                  We're working on adding detailed analytics and activity logs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}