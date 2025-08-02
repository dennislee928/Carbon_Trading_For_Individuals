"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, TrendingUp, AlertTriangle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";

interface Activity {
  id: string;
  type: "user" | "trade" | "error" | "system";
  title: string;
  description: string;
  timestamp: string;
  status?: "success" | "warning" | "error" | "info";
}

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  maxItems?: number;
}

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "user":
      return <User className="h-4 w-4" />;
    case "trade":
      return <TrendingUp className="h-4 w-4" />;
    case "error":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status?: Activity["status"]) => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-800";
    case "warning":
      return "bg-yellow-100 text-yellow-800";
    case "error":
      return "bg-red-100 text-red-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};

export function ActivityFeed({
  activities,
  title = "系統活動",
  maxItems = 10,
}: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  {activity.status && (
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {format(parseISO(activity.timestamp), "MM/dd HH:mm", {
                    locale: zhTW,
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>暫無活動記錄</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
