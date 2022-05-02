import { Log } from "../utils/types";
/**
 █░░█ █▀▀ █▀▀ █▀▀█ 　 █▀▄▀█ █▀▀█ █▀▀▄ █░░█ █░░ █▀▀
 █░░█ ▀▀█ █▀▀ █▄▄▀ 　 █░▀░█ █░░█ █░░█ █░░█ █░░ █▀▀
 ░▀▀▀ ▀▀▀ ▀▀▀ ▀░▀▀ 　 ▀░░░▀ ▀▀▀▀ ▀▀▀░ ░▀▀▀ ▀▀▀ ▀▀▀
 */

export interface UserAccount {
  userId: string;
  username: string;
  password: string;
  name: string;
  email: string;
  NIC: string;
  contactNo: string;
  branchName: string | null;
  accountType: string;
  status: string;
  lastUpdatedBy?: Log | {};
  createdBy: Log | {};
}

export interface Member {}

/**
 * Meta Model
 */
export interface Branch {
  branchName: string;
}

export interface Issue {
  issueId: string;
  name: string;
  branchName: string;
  membershipNo: string;
  contactNo: string;
  title: string;
  description: string;
  status: string;
  issueDate: Date;
  images: any
}
