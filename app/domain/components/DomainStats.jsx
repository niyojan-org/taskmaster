'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Globe,
    CheckCircle2,
    XCircle,
    Server,
    Shield,
    Key
} from 'lucide-react';

export default function DomainStats({ stats }) {
    const statCards = [
        {
            title: 'Total Domains',
            value: stats.total,
            icon: Globe,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Active Domains',
            value: stats.active,
            icon: CheckCircle2,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Inactive Domains',
            value: stats.inactive,
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
        },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statCards.map((stat, index) => (
                    <Card key={index} className={'p-2 px-0 gap-2'}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Environment Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Server className="h-4 w-4" />
                            By Environment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Development</span>
                            <Badge variant="outline">{stats.byEnvironment.development}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Staging</span>
                            <Badge variant="outline">{stats.byEnvironment.staging}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Production</span>
                            <Badge variant="outline">{stats.byEnvironment.production}</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Purpose Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            By Purpose
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">CORS</span>
                            <Badge variant="outline">{stats.byPurpose.cors}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">OAuth</span>
                            <Badge variant="outline">{stats.byPurpose.oauth}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">API</span>
                            <Badge variant="outline">{stats.byPurpose.api}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Passkey</span>
                            <Badge variant="outline">{stats.byPurpose.passkey}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Admin</span>
                            <Badge variant="outline">{stats.byPurpose.admin}</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
