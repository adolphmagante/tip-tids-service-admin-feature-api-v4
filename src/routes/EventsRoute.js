const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/EventsController");
const upload = require("../middleware/UploadMiddleware");
const timeZone = require("../middleware/timeZone");
const {
  validateGetAllEvents,
  validateGetEventDetails,
  validateInvitedTeamMembersQuery
} = require("../middleware/validator/EventValidator");

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - details
 *         - venue
 *         - startDate
 *         - endDate
 *         - registrationCode
 *         - targetCompliance
 *         - category
 *         - type
 *         - numberOfInviteSent
 *         - imageFilename
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for the event
 *         title:
 *           type: string
 *         details:
 *           type: string
 *         venue:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [inactive, active]
 *           default: inactive
 *         registrationCode:
 *           type: string
 *         targetCompliance:
 *           type: number
 *         category:
 *           type: string
 *           enum: [TIDS, teamEvent, happyhere, COP]
 *         type:
 *           type: string
 *         importance:
 *           type: string
 *         googleMeetLink:
 *           type: string
 *         postSurveyURL:
 *           type: string
 *         estimatedBudget:
 *           type: number
 *         numberOfInviteSent:
 *           type: number
 *         pointsNum:
 *           type: number
 *         imageFilename:
 *           type: string
 *         isCompleted:
 *           type: boolean
 *           default: false
 *         isCancelled:
 *           type: boolean
 *           default: false
 *         isArchived:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             workdayId:
 *               type: string
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         updatedBy:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             workdayId:
 *               type: string
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *         required: false
 *         description: Timezone for the response (default UTC)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [inactive, active]
 *       - in: query
 *         name: isCompleted
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isArchived
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Server error
 */
router.get("/", validateGetAllEvents, timeZone, eventsController.getAllEvents);

/**
 * @swagger
 * /events/createEvent:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     parameters:
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *         required: false
 *         description: Timezone for the response (default UTC)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               details:
 *                 type: string
 *               venue:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               registrationCode:
 *                 type: string
 *               targetCompliance:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [TIDS, teamEvent, happyhere, COP]
 *               type:
 *                 type: string
 *               importance:
 *                 type: string
 *               googleMeetLink:
 *                 type: string
 *               postSurveyURL:
 *                 type: string
 *               estimatedBudget:
 *                 type: number
 *               imageFile:
 *                 type: string
 *                 format: binary
 *               teamMembers:
 *                 type: string
 *                 description: JSON string array of team members to assign [{workdayId, email}]
 *     responses:
 *       200:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post("/createEvent", upload.single("imageFile"), timeZone, eventsController.createEvent);

/**
 * @swagger
 * /events/updateEvent:
 *   patch:
 *     summary: Update an existing event
 *     tags: [Events]
 *     parameters:
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *         required: false
 *         description: Timezone for the response (default UTC)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               title:
 *                 type: string
 *               details:
 *                 type: string
 *               venue:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               registrationCode:
 *                 type: string
 *               targetCompliance:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [TIDS, teamEvent, happyhere, COP]
 *               type:
 *                 type: string
 *               importance:
 *                 type: string
 *               googleMeetLink:
 *                 type: string
 *               postSurveyURL:
 *                 type: string
 *               estimatedBudget:
 *                 type: number
 *               imageFile:
 *                 type: string
 *                 format: binary
 *               teamMembers:
 *                 type: string
 *                 description: JSON string array of team members to assign [{workdayId, email}]
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.patch("/updateEvent", upload.single("imageFile"), timeZone, eventsController.updateEvent);

/**
 * @swagger
 * /events/deleteEvent/{id}:
 *   put:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.put("/deleteEvent/:id", eventsController.deleteEvent);

/**
 * @swagger
 * /events/inviteTeamMember:
 *   post:
 *     summary: Invite team member to an event
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamMemberWorkdayId:
 *                 type: string
 *               teamMemberEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team member invited successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Event or team member not found
 *       500:
 *         description: Server error
 */
router.post("/inviteTeamMember", eventsController.inviteTeamMember);

/**
 * @swagger
 * /events/updateInvitedTeamMember:
 *   patch:
 *     summary: Update invited team member status
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamMemberWorkdayId:
 *                 type: string
 *               teamMemberEmail:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [registered, unregistered]
 *     responses:
 *       200:
 *         description: Invited team member status updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Event or team member not found
 *       500:
 *         description: Server error
 */
router.patch("/updateInvitedTeamMember", eventsController.updateInviteTeamMember);

/**
 * @swagger
 * /events/teamMemberEvent:
 *   get:
 *     summary: Get team member events
 *     tags: [Events]
 *     parameters:
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *         required: false
 *         description: Timezone for the response (default UTC)
 *       - in: query
 *         name: teamMemberWorkdayId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: teamMemberEmail
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of team member events
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.get("/teamMemberEvent", validateInvitedTeamMembersQuery, timeZone, eventsController.getTeamMemberEvent);



/**
 * @swagger
 * /events/eventDetails/{id}:
 *   get:
 *     summary: Get event details including invited team members
 *     tags: [Events]
 *     parameters:
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *         required: false
 *         description: Timezone for the response (default UTC)
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details with invited team members
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Event'
 *                 - type: object
 *                   properties:
 *                     invitedTeamMembers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           workdayId:
 *                             type: string
 *                           email:
 *                             type: string
 *                           invitationStatus:
 *                             type: string
 *                             enum: [registered, unregistered]
 *                           invitedDate:
 *                             type: string
 *                             format: date-time
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.get("/eventDetails/:id", validateGetEventDetails, timeZone, eventsController.getEventDetails);

/**
 * @swagger
 * /events/{eventId}/bulkAssign:
 *   post:
 *     summary: Bulk assign team members to an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to assign team members to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamMembers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     workdayId:
 *                       type: string
 *                     email:
 *                       type: string
 *     responses:
 *       200:
 *         description: Team members successfully assigned to the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 assignedCount:
 *                   type: number
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.post("/:eventId/bulkAssign", eventsController.bulkAssignEvent);

module.exports = router;
