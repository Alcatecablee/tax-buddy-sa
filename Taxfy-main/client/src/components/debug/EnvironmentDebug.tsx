import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EnvironmentDebug: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <Card className="max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Environment Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span>Supabase URL:</span>
          <Badge variant={supabaseUrl ? "default" : "destructive"}>
            {supabaseUrl ? "✓ Set" : "✗ Missing"}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span>Supabase Key:</span>
          <Badge variant={supabaseKey ? "default" : "destructive"}>
            {supabaseKey ? `✓ ${supabaseKey.length} chars` : "✗ Missing"}
          </Badge>
        </div>
        {supabaseUrl && (
          <div className="text-xs text-muted-foreground mt-2">
            URL: {supabaseUrl}
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          If credentials are missing, offline mode will be used automatically.
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentDebug;
