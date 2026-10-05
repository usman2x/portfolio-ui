import { FileText, Github, Globe, Linkedin, Mail, Twitter } from "lucide-react"

const iconsByName = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  twitter: Twitter,
  website: Globe,
  email: Mail,
}

export const iconForSocial = name =>
  iconsByName[String(name || "").trim().toLowerCase()] || FileText
