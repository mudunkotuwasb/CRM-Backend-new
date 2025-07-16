const ROLES = {
    admin: {
        value: "ADMIN",
        can: [
            'create_users',
            'manage_roles',
            'assign_projects',
            'view_all_dashboards',
            'export_data',
            'view_all_contacts',
            'view_all_projects',
            'track_all_interactions',
            'set_commissions',
            'view_conversion_reports',
            'send_to_project_team',
            'view_hr_outsourced_roles',
            'view_user_profile_data',
            'view_contact_timeline',
            'define_project_types',
        ]
    },
    management: {
        value: "MANAGEMENT",
        can: [
            'oversee_assigned_projects',
            'view_team_data',
            'view_team_dashboard',
            'track_team_interactions',
            'view_conversion_reports',
            'define_commission_split',
            'view_contact_timeline',
            'view_user_profile_data',
        ]
    },
    marketing_staff: {
        value: "MARKETING_STAFF",
        can: [
            'track_personal_interactions',
            'view_own_dashboard',
            'convert_leads',
            'send_lead_to_closer',
            'view_own_conversion_stats',
            'view_own_commission_income',
            'filter_assigned_contacts',
        ]
    },
    company_representative: {
        value: "COMPANY_REPRESENTATIVE",
        can: [
            'view_own_business_interactions',
            'view_own_growth_metrics',
            'convert_leads',
            'send_lead_to_closer',
            'view_own_conversion_stats',
            'view_own_commission_income',
        ]
    }
}

module.exports = ROLES;