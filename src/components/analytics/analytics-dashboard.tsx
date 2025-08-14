
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, Globe, Monitor, Smartphone, Tablet, RefreshCw } from "lucide-react";
import { format, subDays, subMonths, subYears, startOfWeek, startOfMonth, startOfQuarter, startOfYear } from "date-fns";

interface AnalyticsData {
  totalVisitors: number;
  uniqueVisitors: number;
  returningVisitors: number;
  avgSessionTime: number;
  topCountries: Array<{ country: string; visitors: number }>;
  topStates: Array<{ state: string; visitors: number }>;
  deviceTypes: Array<{ device: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
  dailyVisitors: Array<{ date: string; visitors: number }>;
  pageViews: Array<{ page: string; views: number }>;
}

interface VisitorRecord {
  ip_address: string;
  country: string;
  region: string;
  device_type: string;
  browser: string;
  session_start: string;
}

interface PageViewRecord {
  page_url: string;
  visited_at: string;
}

type TimeFilter = 'week' | 'month' | 'quarter' | 'year';

export function AnalyticsDashboard() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [data, setData] = useState<AnalyticsData>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    returningVisitors: 0,
    avgSessionTime: 0,
    topCountries: [],
    topStates: [],
    deviceTypes: [],
    browsers: [],
    dailyVisitors: [],
    pageViews: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeFilter]);

  const getDateRange = (filter: TimeFilter) => {
    const now = new Date();
    switch (filter) {
      case 'week':
        return { start: startOfWeek(now), end: now };
      case 'month':
        return { start: startOfMonth(now), end: now };
      case 'quarter':
        return { start: startOfQuarter(now), end: now };
      case 'year':
        return { start: startOfYear(now), end: now };
      default:
        return { start: startOfWeek(now), end: now };
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { start, end } = getDateRange(timeFilter);
      
      // Fetch visitor analytics
      const { data: visitors, error: visitorsError } = await supabase
        .from('visitor_analytics')
        .select('*')
        .gte('session_start', start.toISOString())
        .lte('session_start', end.toISOString());

      if (visitorsError) {
        console.error('Error fetching visitors:', visitorsError);
        return;
      }

      // Fetch page views
      const { data: pageViews, error: pageViewsError } = await supabase
        .from('page_views')
        .select('*')
        .gte('visited_at', start.toISOString())
        .lte('visited_at', end.toISOString());

      if (pageViewsError) {
        console.error('Error fetching page views:', pageViewsError);
        return;
      }

      // Process data
      const processedData = processAnalyticsData(visitors || [], pageViews || []);
      setData(processedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (visitors: VisitorRecord[], pageViews: PageViewRecord[]): AnalyticsData => {
    // Calculate unique visitors based on IP address
    const uniqueIPs = new Set(visitors.map(v => v.ip_address));
    const uniqueVisitors = uniqueIPs.size;
    
    // Calculate returning visitors (visitors with multiple sessions)
    const ipCounts = visitors.reduce((acc, v) => {
      acc[v.ip_address] = (acc[v.ip_address] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const returningVisitors = Object.values(ipCounts).filter(count => count > 1).length;

    // Group by country
    const countryStats = visitors.reduce((acc, v) => {
      const country = v.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by state/region
    const stateStats = visitors.reduce((acc, v) => {
      const state = v.region || 'Unknown';
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by device type
    const deviceStats = visitors.reduce((acc, v) => {
      const device = v.device_type || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by browser
    const browserStats = visitors.reduce((acc, v) => {
      const browser = v.browser || 'Unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Daily visitors
    const dailyStats = visitors.reduce((acc, v) => {
      const date = format(new Date(v.session_start), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Page views
    const pageStats = pageViews.reduce((acc, pv) => {
      const page = pv.page_url || '/';
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalVisitors: visitors.length,
      uniqueVisitors,
      returningVisitors,
      avgSessionTime: 0, // We'll calculate this later with proper session tracking
      topCountries: Object.entries(countryStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([country, visitors]) => ({ country, visitors })),
      topStates: Object.entries(stateStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([state, visitors]) => ({ state, visitors })),
      deviceTypes: Object.entries(deviceStats)
        .map(([device, count]) => ({ device, count })),
      browsers: Object.entries(browserStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([browser, count]) => ({ browser, count })),
      dailyVisitors: Object.entries(dailyStats)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, visitors]) => ({ date, visitors })),
      pageViews: Object.entries(pageStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([page, views]) => ({ page, views }))
    };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Annual</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-lg text-gray-500 mt-4">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalVisitors.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.uniqueVisitors.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Returning Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.returningVisitors.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.pageViews.reduce((sum, pv) => sum + pv.views, 0).toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Visitors Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.dailyVisitors}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Types Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.deviceTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, count }) => `${device}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.deviceTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Countries */}
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.topCountries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visitors" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top States */}
            <Card>
              <CardHeader>
                <CardTitle>Top States/Regions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.topStates}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="state" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visitors" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Browsers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Browsers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.browsers.map((browser, index) => (
                    <div key={browser.browser} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium">{browser.browser}</span>
                      </div>
                      <span className="text-sm text-gray-600">{browser.count} visitors</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.pageViews.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium truncate">{page.page}</span>
                      </div>
                      <span className="text-sm text-gray-600">{page.views} views</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
