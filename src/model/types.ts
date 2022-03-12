

/**
 █░░█ █▀▀ █▀▀ █▀▀█ 　 █▀▄▀█ █▀▀█ █▀▀▄ █░░█ █░░ █▀▀
 █░░█ ▀▀█ █▀▀ █▄▄▀ 　 █░▀░█ █░░█ █░░█ █░░█ █░░ █▀▀
 ░▀▀▀ ▀▀▀ ▀▀▀ ▀░▀▀ 　 ▀░░░▀ ▀▀▀▀ ▀▀▀░ ░▀▀▀ ▀▀▀ ▀▀▀
 */

export interface UserAccount {
    userId: string,
    username: string,
    password : string,
    name: string, 
    email: string,
    NIC: string,
    contactNo: string,
    branchName: string | null
    accountType: string,
    active : string,
}



