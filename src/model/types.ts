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

export interface Event {
  eventId: string;
  title: string;
  description: string;
  date: Date;
  images: any;
}

export interface BranchSecretary{
  branchSecId: string;
  name: string;
  branchName: string;
  contactNo: string;
}

export interface CommitteeMember {
  committeeMemberId: string;
  name: string;
  position: string;
  contactNo: string;
  order: number;
}

export interface Leader {
  order: number,
  leaderId: string;
  name: string;
  position: string;
  contactNo: string;
}

export interface Announcement {
  announcementId: string;
  title: string;
  content: string;
  date: Date;
  images: any;
}