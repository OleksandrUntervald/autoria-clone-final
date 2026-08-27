export enum Permission {
    // Права для оголошень
    CREATE_AD = 'create_ad',
    EDIT_OWN_AD = 'edit_own_ad',
    DELETE_OWN_AD = 'delete_own_ad',
    DELETE_ANY_AD = 'delete_any_ad', // Для менеджерів/адмінів

    // Модерація та користувачі
    BAN_USER = 'ban_user',
    CREATE_MANAGER = 'create_manager', // Тільки для Адміна

    // Статистика (Преміум)
    VIEW_STATISTICS = 'view_statistics',
}