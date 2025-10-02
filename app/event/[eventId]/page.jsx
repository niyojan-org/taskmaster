"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, AlertTriangle, Eye, Building2, Flag, Ban, CheckCircle, Ticket, Users } from "lucide-react";
import { toast } from "sonner";

export default function EventManageCenter() {
  const params = useParams();
  const eventId = params?.eventId;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [flagReason, setFlagReason] = useState("");
  const [flagSeverity, setFlagSeverity] = useState("minor");
  const [blockLoading, setBlockLoading] = useState(false);
  const [flagLoading, setFlagLoading] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/tm/event/${eventId}`);
      if (response.data.success) {
        setEvent(response.data.event);
      } else {
        setError(response.data.message || "Failed to fetch event");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId]);

  const handleBlock = async () => {
    if (!blockReason) return toast.error("Block reason required");
    setBlockLoading(true);
    try {
      const response = await api.patch(`/tm/event/block/${eventId}`, { reason: blockReason });
      if (response.data.success) {
        toast.success("Event blocked successfully");
        fetchEvent();
        setBlockReason("");
      } else {
        toast.error(response.data.message || "Failed to block event");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error blocking event");
    }
    setBlockLoading(false);
  };

  const handleUnblock = async () => {
    setBlockLoading(true);
    try {
      const response = await api.patch(`/tm/event/unblock/${eventId}`);
      if (response.data.success) {
        toast.success("Event unblocked successfully");
        fetchEvent();
      } else {
        toast.error(response.data.message || "Failed to unblock event");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error unblocking event");
    }
    setBlockLoading(false);
  };

  const handleFlag = async () => {
    if (!flagReason) return toast.error("Flag reason required");
    setFlagLoading(true);
    try {
      const response = await api.patch(`/tm/event/flag/${eventId}`, { reason: flagReason, severity: flagSeverity });
      if (response.data.success) {
        toast.success("Event flagged successfully");
        fetchEvent();
        setFlagReason("");
      } else {
        toast.error(response.data.message || "Failed to flag event");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error flagging event");
    }
    setFlagLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading event details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-500 mb-2">{error}</div>
          <Button onClick={fetchEvent} className="bg-blue-600 text-white">Try Again</Button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen py-10 px-0">
      <div className="w-full max-w-7xl mx-auto">
        <Card className="shadow-2xl border-0 w-full overflow-hidden">
          <CardHeader className="flex flex-col md:flex-row items-center gap-8 pb-8">
            <div className="flex-shrink-0">
              {event.bannerImage ? (
                <img src={event.bannerImage} alt={event.title} className="w-40 h-40 rounded-2xl object-cover border-2 border-gray-200" />
              ) : (
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <Calendar className="w-20 h-20 text-blue-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-4xl font-bold text-gray-800 mb-2">{event.title}</CardTitle>
              <CardDescription className="text-gray-600 mb-2 text-lg">{event.description}</CardDescription>
              <div className="flex gap-2 flex-wrap mb-2">
                <Badge variant="secondary" className="text-base">{event.category}</Badge>
                <Badge variant={event.status === "blocked" ? "destructive" : "default"} className="text-base">{event.status}</Badge>
                {event.featured && <Badge variant="default" className="text-base">Featured</Badge>}
                {event.fraudulent && <Badge variant="destructive" className="text-base">Fraudulent</Badge>}
                {event.isBlocked && <Badge variant="destructive" className="text-base">Blocked</Badge>}
                {event.isPublished ? <Badge variant="default" className="text-base">Published</Badge> : <Badge variant="secondary" className="text-base">Draft</Badge>}
                {event.isPrivate && <Badge variant="secondary" className="text-base">Private</Badge>}
                {event.isRegistrationOpen && <Badge variant="default" className="text-base">Registration Open</Badge>}
              </div>
              <div className="flex gap-2 items-center text-sm text-gray-500 mb-2 flex-wrap">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span>{event.organization?.name}</span>
                <span className="ml-2 text-xs text-gray-400">({event.organization?.email})</span>
                <Tag className="h-4 w-4 text-gray-500 ml-4" />
                <span>{event.tags?.join(", ")}</span>
              </div>
              
            </div>
          </CardHeader>
          <CardContent className="space-y-10">
            {/* Event Meta Info Card */}
            <Card className="border-0 bg-indigo-50/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-500" /> Event Meta Info
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
                <div><strong>Created:</strong> {new Date(event.createdAt).toLocaleString()}</div>
                <div><strong>Updated:</strong> {new Date(event.updatedAt).toLocaleString()}</div>
                <div><strong>Slug:</strong> {event.slug}</div>
                <div><strong>Event ID:</strong> {event._id}</div>
                <div><strong>Type:</strong> {event.type}</div>
                <div><strong>Mode:</strong> {event.mode}</div>
                <div><strong>View Count:</strong> {event.viewCount}</div>
                <div><strong>Total Registrations:</strong> {event.totalRegistrations}</div>
                <div><strong>Registration:</strong> {new Date(event.registrationStart).toLocaleString()} - {new Date(event.registrationEnd).toLocaleString()}</div>
                <div><strong>Auto Approve:</strong> {event.autoApproveParticipants ? "Yes" : "No"}</div>
                <div><strong>Allow Multiple Sessions:</strong> {event.allowMultipleSessions ? "Yes" : "No"}</div>
                <div><strong>Allow Coupons:</strong> {event.allowCoupons ? "Yes" : "No"}</div>
                <div><strong>Email Notifications:</strong> {event.enableEmailNotifications ? "Yes" : "No"}</div>
                <div><strong>SMS Notifications:</strong> {event.enableSmsNotifications ? "Yes" : "No"}</div>
                <div><strong>Feedback Enabled:</strong> {event.feedbackEnabled ? "Yes" : "No"}</div>
              </CardContent>
            </Card>
            {/* Organization Details */}
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-500" /> Organization Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 rounded-lg p-4">
                  <div className="font-semibold text-gray-800">{event.organization?.name}</div>
                  <div className="text-sm text-gray-500">Email: {event.organization?.email}</div>
                  <div className="text-sm text-gray-500">Slug: {event.organization?.slug}</div>
                  {event.organization?.logo && <img src={event.organization.logo} alt="Org Logo" className="w-20 h-20 mt-2 rounded-lg object-cover" />}
                </div>
              </div>
            </div>
            {/* Sessions */}
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500" /> Sessions</h3>
              {event.sessions?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.sessions.map((session) => (
                    <Card key={session._id} className="bg-blue-50/50 border-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">{session.title}</CardTitle>
                        <CardDescription className="text-xs text-gray-500">{session.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-1 text-sm">
                        <div><strong>Venue:</strong> {session.venue?.name}, {session.venue?.city}, {session.venue?.address}</div>
                        <div><strong>Start:</strong> {new Date(session.startTime).toLocaleString()}</div>
                        <div><strong>End:</strong> {new Date(session.endTime).toLocaleString()}</div>
                        <div><strong>Zip:</strong> {session.venue?.zipCode}</div>
                        <div><strong>Country:</strong> {session.venue?.country}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No sessions available</div>
              )}
            </div>
            {/* Tickets */}
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Ticket className="w-5 h-5 text-indigo-500" /> Tickets</h3>
              {event.tickets?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.tickets.map((ticket) => (
                    <Card key={ticket._id} className="bg-indigo-50/50 border-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">{ticket.type}</CardTitle>
                        <CardDescription className="text-xs text-gray-500">Capacity: {ticket.capacity}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-1 text-sm">
                        <div><strong>Price:</strong> ₹{ticket.price}</div>
                        <div><strong>Sold:</strong> {ticket.sold}</div>
                        {ticket.templateUrl && <div><strong>Template:</strong> <a href={ticket.templateUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">View</a></div>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No tickets available</div>
              )}
            </div>
            {/* Input Fields */}
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Tag className="w-5 h-5 text-blue-500" /> Input Fields</h3>
              {event.inputFields?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.inputFields.map((field) => (
                    <Card key={field._id} className="bg-blue-50/50 border-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">{field.label}</CardTitle>
                        <CardDescription className="text-xs text-gray-500">Type: {field.type} {field.required && <span className="text-red-500">(Required)</span>}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-1 text-sm">
                        {field.options?.length ? <div><strong>Options:</strong> {field.options.join(", ")}</div> : <div>No options</div>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No input fields</div>
              )}
            </div>
            {/* Fraud Flags */}
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Flag className="w-5 h-5 text-red-500" /> Fraud Flags</h3>
              {event.fraudFlags?.length ? (
                <ul className="space-y-2">
                  {event.fraudFlags.map((flag) => (
                    <li key={flag._id} className="bg-red-50 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <span className="font-semibold text-red-600">{flag.severity}</span> - {flag.reason}
                        <span className="ml-2 text-xs text-gray-500">Flagged at: {new Date(flag.flaggedAt).toLocaleString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No fraud flags</div>
              )}
            </div>
            {/* Block/Unblock/Flag Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 bg-blue-50/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2"><Ban className="w-5 h-5 text-blue-500" /> Block/Unblock Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event.isBlocked ? (
                    <Button onClick={handleUnblock} disabled={blockLoading} className="w-full bg-green-600 text-white">
                      <CheckCircle className="w-4 h-4 mr-1" /> Unblock Event
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Reason to block event"
                        value={blockReason}
                        onChange={e => setBlockReason(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                      <Button onClick={handleBlock} disabled={blockLoading || !blockReason} className="w-full bg-red-600 text-white">
                        <Ban className="w-4 h-4 mr-1" /> Block Event
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="border-0 bg-red-50/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2"><Flag className="w-5 h-5 text-red-500" /> Flag Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <input
                    type="text"
                    placeholder="Reason to flag event"
                    value={flagReason}
                    onChange={e => setFlagReason(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                  <select
                    value={flagSeverity}
                    onChange={e => setFlagSeverity(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                    <option value="critical">Critical</option>
                  </select>
                  <Button onClick={handleFlag} disabled={flagLoading || !flagReason} className="w-full bg-red-600 text-white">
                    <Flag className="w-4 h-4 mr-1" /> Flag Event
                  </Button>
                </CardContent>
              </Card>
            </div>
            {/* Attachments & Media Gallery */}
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-500" /> Media Gallery & Attachments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.mediaGallery?.length ? event.mediaGallery.map((media, idx) => (
                  <Card key={idx} className="border-0 bg-blue-50/40">
                    <CardContent className="p-2">
                      <img src={media.url} alt="Media" className="w-full h-40 object-cover rounded-lg" />
                    </CardContent>
                  </Card>
                )) : <div className="text-gray-500">No media files</div>}
                {event.attachments?.length ? event.attachments.map((att, idx) => (
                  <Card key={idx} className="border-0 bg-indigo-50/40">
                    <CardContent className="p-2">
                      <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{att.type || "Attachment"}</a>
                    </CardContent>
                  </Card>
                )) : <div className="text-gray-500">No attachments</div>}
              </div>
            </div>
            {/* Guest Speakers */}
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> Guest Speakers</h3>
              {event.guestSpeakers?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.guestSpeakers.map((speaker, idx) => (
                    <Card key={idx} className="border-0 bg-blue-50/40">
                      <CardContent className="p-2">
                        <div className="font-semibold text-gray-800">{speaker.name}</div>
                        <div className="text-sm text-gray-500">{speaker.bio}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : <div className="text-gray-500">No guest speakers</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
