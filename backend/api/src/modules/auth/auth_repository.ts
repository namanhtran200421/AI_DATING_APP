import {pool} from "../../config/db.js";

export async function findUserByEmail(email:string) {
    const result = await pool.query ( 
        'SELECT user_id, email, password_hash, account_status, user_role FROM users WHERE email = $1', [email]
    );
    return result.rows[0];
}

export async function findAuthProvider(provider:string, providerUserId: string) {
    const result = await pool.query (
        'SELECT U.user_id, U.user_email, U.account_status, U.user_role FROM users U INNER JOIN auth_providers AP on U.user_id = AP.user_id WHERE ap.provider = $1 AND ap.provider_user_id = $2', [provider, providerUserId]
     );
     return result.rows[0];
}

export async function createEmailPasswordUser(email:string, passwordHash: string){
    const client = await pool.connect();

    try {
        //start transactions
        await client.query('BEGIN');
        const userResult = await client.query( 
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id, email, account_status, user_role', [email, passwordHash]
        );
        const user = userResult.rows[0];

        await client.query(
            `
            INSERT INTO auth_providers (user_id, provider, provider_user_id)
            VALUES ($1, 'EMAIL_PASSWORD', $2)
            `,
            [user.user_id, email]
        );

        await client.query('COMMIT');
        return user;

    } catch (err:any){
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

export async function createOAuthUser(
    email:string, 
    provider:string, 
    providerUserId: string,

) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

       const userResult = await client.query(
            'INSERT INTO users(email, password_hash) VALUES ($1, NULL) RETURNING user_id, email_account_status, user_role',
            [email]
        );

        const user = userResult.rows[0];

        await client.query(
            'INSERT INTO auth_providers (user_id, provider, provider_user_id) VALUES ($1, $2, $3) ', [user.user_id, provider, providerUserId]
        )
        await client.query("COMMIT");

        return user;

    }catch (err:any) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();

    }
}

export async function linkOAuthProviderToExistingUser(
    userId: number, 
    provider: string, 
    providerUserId: string
) {
    await pool.query(
    'INSERT INTO auth_providers (user_id, provider, provider_user_id) VALUES($1, $2, $3) ON CONFLICT DO NOTHING', [userId, provider, providerUserId]  
);

}

export async function findCurrentUserById(userId: number) {
    const result = await pool.query (
        'SELECT user_id, email, account_status, user_role, created_at, updated_at FROM users WHERE user_id = $1', [userId]
    );

    return result.rows[0];
}